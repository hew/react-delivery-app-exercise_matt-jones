import {render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'
import { Days, Sort } from './globals'

test('App Loads Renders Without Error', async () => {
  render(<App />)

  expect(await screen.findByText('Showing Deliveries for Today')).toBeVisible()
})

test('App Loads The Deliveries from the \'server\' ', async () => {
  render(<App />)

  expect(await screen.findByText('Delivery #1')).toBeVisible()
})


test('It should show the deliveries for tomorrow.', async () => {
  render(<App />)

  const input = await screen.findByTestId('select-day')
  fireEvent.change(input, { target: { value: Days.TOMORROW } })

  expect(await screen.findByText('Showing Deliveries for Tomorrow')).toBeVisible()
})

test('It should upadate when an order is accepted.', async () => {
  render(<App />)

  const acceptButton = await screen.findAllByText('Accept');
  fireEvent.click(acceptButton[0]);

  expect(await screen.findByTestId('driver_confirmed')).toBeVisible()
})
