import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { stubFetchJson, stubFetchNetworkError } from './test/fetch'
import { users } from './test/fixtures/users'

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('shows sample users with a loading notice, then swaps in the API users', async () => {
    stubFetchJson(users)
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getByText('Loading the latest users…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anna Martins' })).toBeInTheDocument()

    expect(await screen.findByRole('button', { name: 'Leanne Graham' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Anna Martins' })).not.toBeInTheDocument()
    expect(screen.queryByText('Loading the latest users…')).not.toBeInTheDocument()
    expect(screen.queryByText('Showing sample data')).not.toBeInTheDocument()
  })

  it('keeps the sample data and says so when the API cannot be reached', async () => {
    stubFetchNetworkError()
    render(<App />)
    expect(await screen.findByText('Showing sample data')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Joao Pereira' })).toBeInTheDocument()
  })

  it('shows only the address and phone number when a user is expanded', async () => {
    const user = userEvent.setup()
    stubFetchJson(users)
    render(<App />)
    await user.click(await screen.findByRole('button', { name: 'Leanne Graham' }))
    const details = screen.getByRole('region', { name: 'Leanne Graham' })
    expect(details).toHaveTextContent('Kulas Light')
    expect(details).toHaveTextContent('1-770-736-8031 x56442')
    expect(details).not.toHaveTextContent('Coordinates')
  })
})
