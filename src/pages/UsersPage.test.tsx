import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { users } from '../test/fixtures/users'
import UsersPage from './UsersPage'

describe('UsersPage', () => {
  it('disables search and shows placeholders while loading', () => {
    render(<UsersPage status="loading" users={[]} source={null} onReload={vi.fn()} />)
    expect(screen.getByRole('combobox', { name: 'Search users' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('Loading users…')
  })

  it('filters the list in real time while typing', async () => {
    const user = userEvent.setup()
    render(<UsersPage status="success" users={users} source="api" onReload={vi.fn()} />)
    expect(screen.getAllByRole('button', { name: /Graham|Howell|Bauch/ })).toHaveLength(3)
    await user.type(screen.getByRole('combobox', { name: 'Search users' }), 'howe')
    expect(screen.getAllByRole('button', { name: /Graham|Howell|Bauch/ })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Ervin Howell' })).toBeInTheDocument()
  })

  it('shows a no-results message and recovers when the search is cleared', async () => {
    const user = userEvent.setup()
    render(<UsersPage status="success" users={users} source="api" onReload={vi.fn()} />)
    const input = screen.getByRole('combobox', { name: 'Search users' })
    await user.type(input, 'zzz')
    expect(screen.getByText('No matching users')).toBeInTheDocument()
    await user.clear(input)
    expect(screen.getAllByRole('button', { name: /Graham|Howell|Bauch/ })).toHaveLength(3)
  })

  it('keeps expanded names open while filtering', async () => {
    const user = userEvent.setup()
    render(<UsersPage status="success" users={users} source="api" onReload={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Leanne Graham' }))
    await user.type(screen.getByRole('combobox', { name: 'Search users' }), 'zzz')
    await user.clear(screen.getByRole('combobox', { name: 'Search users' }))
    expect(screen.getByRole('button', { name: 'Leanne Graham' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('warns about sample data and offers a retry', async () => {
    const user = userEvent.setup()
    const onReload = vi.fn()
    render(<UsersPage status="success" users={users} source="mock" onReload={onReload} />)
    expect(screen.getByText('Showing sample data')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onReload).toHaveBeenCalledOnce()
  })

  it('does not show the sample data notice for API data', () => {
    render(<UsersPage status="success" users={users} source="api" onReload={vi.fn()} />)
    expect(screen.queryByText('Showing sample data')).not.toBeInTheDocument()
  })
})
