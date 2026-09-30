import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { users } from '../../test/fixtures/users'
import UserList from './UserList'

describe('UserList', () => {
  it('announces the loading state without exposing placeholder rows', () => {
    render(<UserList status="loading" />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading users…')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows the error state and retries on request', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<UserList status="error" onRetry={onRetry} />)
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load users")
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('shows the empty state when there are no users', () => {
    render(<UserList status="success" users={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent('No users yet')
  })

  it('lists every name collapsed by default', () => {
    render(<UserList status="success" users={users} />)
    expect(screen.getAllByRole('button', { name: /Graham|Howell|Bauch/ })).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Leanne Graham' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Kulas Light')).not.toBeVisible()
  })

  it('reveals the address of several names at once', async () => {
    const user = userEvent.setup()
    render(<UserList status="success" users={users} />)
    await user.click(screen.getByRole('button', { name: 'Leanne Graham' }))
    await user.click(screen.getByRole('button', { name: 'Ervin Howell' }))
    expect(screen.getByText('Kulas Light')).toBeVisible()
    expect(screen.getByText('Victor Plains')).toBeVisible()
    expect(screen.getByText('2 of 3 expanded')).toBeInTheDocument()
  })

  it('collapses a single name without affecting the others', async () => {
    const user = userEvent.setup()
    render(<UserList status="success" users={users} />)
    await user.click(screen.getByRole('button', { name: 'Leanne Graham' }))
    await user.click(screen.getByRole('button', { name: 'Ervin Howell' }))
    await user.click(screen.getByRole('button', { name: 'Leanne Graham' }))
    expect(screen.getByRole('button', { name: 'Leanne Graham' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Victor Plains')).toBeVisible()
  })

  it('expands and collapses everything from the toolbar', async () => {
    const user = userEvent.setup()
    render(<UserList status="success" users={users} />)
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Expand all' }))
    expect(screen.getByText('No address on file.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Expand all' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Collapse all' }))
    expect(screen.getByText('0 of 3 expanded')).toBeInTheDocument()
  })

  it('disables every control when the list is disabled', () => {
    render(<UserList status="success" users={users} disabled />)
    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
  })
})
