/* eslint-disable react/prop-types */
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { DateRangePicker } from 'react-dates'
import { State } from 'react-powerplug'
import Holen from 'holen'
import { sha256 } from 'js-sha256'
import moment from 'moment'
import FocusLock from 'react-focus-lock'
import { Preload } from 'react-preload'

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

import backgroundImage from './background2.jpg'
import airplane from './airplane.svg'
import heart from './heart.png'
import members from './members'

const images = [airplane, heart, backgroundImage].concat(
  members.map(({ photo }) => photo)
)

const Page = styled.div`
  height: 100vh;
  padding: 3rem 4rem;
  box-sizing: border-box;
  background-position: top right;
  background-size: cover;
  background-image: url("${backgroundImage}");
  overflow: auto;
`

const Title = styled.h1`
  margin: 0;
  text-indent: -4px;
  font-size: 4em;
  font-family: 'Cardo', serif;
`

const Subtitle = styled.span`
  display: block;
  text-transform: uppercase;
  font-size: 1.2em;
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.1875em;
`

const Flag = styled.img`
  width: 36px;
  margin-left: 0.4em;
  vertical-align: middle;
`

const Text = styled.p`
  font-family: 'Cardo', serif;
  max-width: 32em;

  ${({ big }) =>
    big &&
    `
    font-size: 1.2em;
    font-weight: bold;
  `};
`

const Form = styled.div`
  margin-bottom: 2em;

  .DateRangePicker {
    vertical-align: middle;
  }

  .DateInput_input {
    font-size: 1em;
    font-family: 'Cardo', serif;
  }
`

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 1px, 0) rotate(1deg);
  }

  20%, 80% {
    transform: translate3d(0px, 0px, 0) rotate(0deg);
  }

  30%, 50%, 70% {
    transform: translate3d(-1px, -1px, 0) rotate(1deg);
  }

  40%, 60% {
    transform: translate3d(1px, 0, 0) rotate(0deg);
  }
`

const Link = styled.a`
  color: #c63616;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`

const Field = styled.div`
  display: inline-block;
  width: 10em;
  margin-left: 1em;
  border: 1px solid #dbdbdb;
  border-radius: 2px;
  vertical-align: middle;
`

const Input = styled.input``

const Button = styled.button`
  position: relative;
  padding: 0.4em 2em 0.45em;
  margin-left: 1em;
  border: 0;
  color: white;
  font-weight: bold;
  font-size: 1em;
  font-family: 'Cardo', serif;
  vertical-align: middle;
  overflow: hidden;
  transition: 200ms ease-in-out;
  outline: transparent;
  background-color: #ffc6bc;

  &[disabled] {
    filter: grayscale(0);
    opacity: 0.2;
  }

  &:not([disabled]) {
    cursor: pointer;

    &:hover {
      background-color: #ffb5a8;
    }
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: -80px;
    top: 5px;
    width: 32px;
    height: 40px;
    background-image: url(${airplane});
    transition: left 200ms ease-in-out;

    transform: translate3d(0, 0, 0) rotate(0deg);
    animation: ${shake} 5s ease-in-out infinite;
    backface-visibility: hidden;
    perspective: 1000px;
  }

  &:not([disabled]):hover {
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.05);

    &:before {
      left: 5px;
    }
  }

  ${({ submitting }) =>
    submitting &&
    `
    &:before {
      left: 100% !important;
    }
  `};
`

const Credits = styled.span`
  position: fixed;
  font-size: 0.7em;
  right: 1em;
  bottom: 1em;
  filter: grayscale(100%);
  transition: filter 200ms ease-in-out;
  cursor: default;

  &:hover {
    filter: grayscale(0);
  }
`

const beat = keyframes`
  to {
    transform: scale(1.2);
  }
`

const Love = styled.img`
  vertical-align: sub;

  ${Credits}:hover & {
    animation: ${beat} 0.3s infinite alternate;
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 200, 200, 0.4);
  z-index: 1000;
  overflow: auto;
  padding: 3rem 4rem;
  text-align: center;
`

const ModalContent = styled.div`
  max-width: 38rem;
  padding: 2rem 3rem;
  background-color: white;
  position: relative;
  z-index: 10;
  display: inline-block;
  text-align: center;
`

const ModalClose = styled.button`
  content: 'x';
  background: transparent;
  border: none;
  font-weight: bold;
  font-size: 1.5em;
  font-family: 'Montserrat', sans-serif;
  color: white;
  position: fixed;
  top: 0.5em;
  right: 1em;
  cursor: pointer;
  display: block;
  outline: none;
`

const Modal = ({ children, onClose = () => {} }) => (
  <ModalOverlay onClick={ onClose }>
    <FocusLock>
      <ModalContent onClick={ e => e.stopPropagation() }>
        { onClose && <ModalClose onClick={ onClose }>x</ModalClose> }
        { children }
      </ModalContent>
    </FocusLock>
  </ModalOverlay>
)

const initialState = {
  startDate: null,
  endDate: null,
  focusedInput: null,
  submitting: false,
  editing: false,
  secret: '',
  error: null,
  showError: null,
  scheduled: false,
  showSuccess: false,
  showMembers: false,
}

const storage =
  'https://wt-1cda89f1fbe853160953a0bb5aabe5f5-0.sandbox.auth0-extend.com/kristin-guilherme'

const secretHash =
  '7e4c0d012bd90cad2c93096c6b94f51e7249fa2410729adae4ca6a09689ad21d'

const CouldNotScheduleError = 'Could not schedule! Please, try again later :('

export default () => (
  <Preload
    images={ images }
    autoResolveDelay={ 10000 }
    resolveOnError
    mountChildren
  >
    <Holen url={ storage }>
      { ({ fetching, data, error }) =>
        fetching ? null : (
          <State initial={ { ...initialState, ...data.data } }>
            { ({
              state: {
                startDate,
                endDate,
                focusedInput,
                secret,
                editing,
                showError,
                error,
                scheduled,
                showSuccess,
                showMembers,
              },
              setState,
            }) => (
              <Holen
                lazy
                url={ storage }
                method='POST'
                headers={ { 'content-type': 'application/json' } }
                onResponse={ (err, { status, data = {} }) => {
                  setState(
                    err || status !== 200
                      ? {
                        showError: true,
                        error: data.error || CouldNotScheduleError,
                      }
                      : {
                        showSuccess: true,
                        scheduled: true,
                        editing: false,
                      }
                  )
                } }
              >
                { ({ fetching: submitting, fetch: schedule }) => (
                  <Page>
                    { showError && (
                      <Modal onClose={ () => setState({ showError: false }) }>
                        <h3>Ops!</h3>
                        <p>{ error }</p>
                      </Modal>
                    ) }
                    { showSuccess && (
                      <Modal onClose={ () => setState({ showSuccess: false }) }>
                        <h3>Woohoo!</h3>
                        <p>Thanks for letting us know!</p>
                        <p>
                          We'll get back to you as soon as we have your flight
                          details ;)
                        </p>
                      </Modal>
                    ) }
                    { showMembers && (
                      <Modal onClose={ () => setState({ showMembers: false }) }>
                        <Members />
                      </Modal>
                    ) }
                    <header>
                      <Title>Kristin & Guilherme</Title>
                      <Subtitle>
                        You are coming to
                        <Flag src='https://www.shareicon.net/data/144x144/2016/08/04/806847_flag_512x512.png' />{ ' ' }
                      </Subtitle>
                    </header>
                    { scheduled &&
                      !editing && (
                      <Text>
                          We are expecting you here{ ' ' }
                        <i
                          title={ `From ${moment(startDate).format(
                            'dddd, MMMM Do YYYY'
                          )} to ${moment(endDate).format(
                            'dddd, MMMM Do YYYY'
                          )}` }
                        >
                          { moment(startDate).fromNow() }!
                        </i>
                        <br />If you change you plans, please{ ' ' }
                        <Link
                          href='#'
                          onClick={ () => setState({ editing: true }) }
                        >
                            let us now.
                        </Link>
                      </Text>
                    ) }

                    { !scheduled || editing ? (
                      <div>
                        <Text big>Please, choose the dates below:</Text>

                        <Form>
                          <DateRangePicker
                            startDate={ startDate && moment(startDate) }
                            startDateId='start'
                            startDatePlaceholderText='Depart'
                            endDate={ endDate && moment(endDate) }
                            endDateId='end'
                            endDatePlaceholderText='Return'
                            onDatesChange={ setState }
                            focusedInput={ focusedInput }
                            onFocusChange={ focusedInput =>
                              setState({ focusedInput })
                            }
                            withPortal
                            hideKeyboardShortcutsPanel
                          />

                          <Field>
                            <Input
                              type='text'
                              name='secret'
                              placeholder='Secret code'
                              className='DateInput_input'
                              value={ secret }
                              onChange={ e =>
                                setState({ secret: e.target.value })
                              }
                            />
                          </Field>

                          <Button
                            submitting={ submitting }
                            disabled={
                              !startDate ||
                              !endDate ||
                              sha256(secret) !== secretHash
                            }
                            onClick={ () =>
                              schedule({
                                body: JSON.stringify({
                                  startDate,
                                  endDate,
                                  secret,
                                }),
                              })
                            }
                          >
                            <span>Let us know</span>
                          </Button>
                        </Form>
                      </div>
                    ) : null }
                    <Text>
                      This was made possible by the help of{ ' ' }
                      <Link
                        href='#'
                        onClick={ () => setState({ showMembers: true }) }
                      >
                        many of your friends
                      </Link>{ ' ' }
                      in Brazil. As most of us could not attend the wedding, we
                      agreed that the best gift we could give you both was the
                      opportunity to beat the distance once again and share with
                      us a part of this moment.
                    </Text>
                    <Text big>We are looking forward to welcome you!</Text>
                    <Credits>
                      Made with <Love src={ heart } alt='love' /> by the{ ' ' }
                      <Link
                        href='https://www.facebook.com/lucasconstantino'
                        target='_blank'
                      >
                        Best Man
                      </Link>
                    </Credits>
                  </Page>
                ) }
              </Holen>
            ) }
          </State>
        )
      }
    </Holen>
  </Preload>
)

const Avatar = styled.a`
  display: block;
  width: 140px;
  color: inherit;
  text-decoration: none;

  h4 {
    margin: 0;
    font-size: 0.8em;
    text-align: center;
    font-weight: normal;
  }

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`

const PhotoWrapper = styled.div`
  padding: 1em 1em 0.25em 1em;

  > div {
    position: relative;
    padding-top: 100%;
  }
`

const Photo = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  padding: 2px;
  border: 3px dashed #ffc6bc;
`

const Member = ({ name, url, photo }) => (
  <Avatar href={ url } target='_blank'>
    <PhotoWrapper>
      <div>
        <Photo src={ photo } alt={ url } title={ name } />
      </div>
    </PhotoWrapper>
    <h4>{ name }</h4>
  </Avatar>
)

const StyledMembers = styled.div`
  ul {
    display: block;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
    margin: 0 0.25em 0.25em 0.25em;
  }
`

const Members = () => (
  <StyledMembers>
    <Text big>These people helped you come to Brazil:</Text>
    <ul>
      { members.map(member => (
        <li key={ member.name }>
          <Member { ...member } />
        </li>
      )) }
    </ul>
  </StyledMembers>
)
