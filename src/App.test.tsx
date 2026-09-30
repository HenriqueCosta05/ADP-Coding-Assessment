import { render, screen } from '@testing-library/react'
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

  it('shows the loading state, then the users returned by the API', async () => {
    stubFetchJson(users)
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading users…')
    expect(await screen.findByRole('button', { name: 'Leanne Graham' })).toBeInTheDocument()
    expect(screen.queryByText('Showing sample data')).not.toBeInTheDocument()
  })

  it('falls back to sample data when the API cannot be reached', async () => {
    stubFetchNetworkError()
    render(<App />)
    expect(await screen.findByText('Showing sample data')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mrs. Dennis Schulist' })).toBeInTheDocument()
  })
})
