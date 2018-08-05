import React from 'react'
import styled, { keyframes } from 'styled-components'
import { DateRangePicker } from 'react-dates'
import { State } from 'react-powerplug'

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

import backgroundImage from './background.jpg'
import airplane from './airplane.svg'

const Page = styled.div`
  height: 100vh;
  padding: 3rem 4rem;
  box-sizing: border-box;
  background-position: top right;
  background-size: cover;
  background-image: url("${backgroundImage}");
`

const Title = styled.h1`
  margin: 0;
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
  font-size: 1.2em;
  font-family: 'Cardo', serif;
`

const Form = styled.form`
  .DateRangePicker {
    vertical-align: middle;
  }

  .DateInput_input {
    font-size: 1.2em;
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

const Button = styled.button`
  position: relative;
  padding: 0.4em 2em 0.45em;
  margin-left: 1em;
  border: 0;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  font-family: 'Cardo', serif;
  vertical-align: middle;
  overflow: hidden;
  transition: 200ms ease-in-out;
  outline: transparent;

  &[disabled] {
    background-color: #646464;
    opacity: 0.2;
  }

  &:not([disabled]) {
    cursor: pointer;
    background-color: #ffc6bc;

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
    width: 40px;
    height: 50px;
    background-image: url(${airplane});
    transition: left 200ms ease-in-out;

    transform: translate3d(0, 0, 0) rotate(0deg);
    animation: ${shake} 7s ease-in-out infinite;
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

const initialState = {
  startDate: null,
  endDate: null,
  focusedInput: null,
  submitting: false,
}

export default () => (
  <State initial={ initialState }>
    { ({
      state: { startDate, endDate, focusedInput, submitting },
      setState,
    }) => (
      <Page>
        <header>
          <Title>Kristin & Guilherme</Title>
          <Subtitle>
            You are comming to
            <Flag src='https://www.shareicon.net/data/144x144/2016/08/04/806847_flag_512x512.png' />{ ' ' }
          </Subtitle>
        </header>
        <Text>Choose the dates below:</Text>

        <Form
          onSubmit={ e => {
            e.preventDefault()
            setState({ submitting: true })
          } }
        >
          <DateRangePicker
            startDate={ startDate }
            startDateId='start'
            startDatePlaceholderText='Depart'
            endDate={ endDate }
            endDateId='end'
            endDatePlaceholderText='Return'
            onDatesChange={ setState }
            focusedInput={ focusedInput }
            onFocusChange={ focusedInput => setState({ focusedInput }) }
            withPortal
            hideKeyboardShortcutsPanel
          />

          <Button submitting={ submitting } disabled={ false }>
            <span>Schedule</span>
          </Button>

          <pre>{ JSON.stringify({ startDate, endDate }, null, 2) }</pre>
        </Form>
      </Page>
    ) }
  </State>
)
