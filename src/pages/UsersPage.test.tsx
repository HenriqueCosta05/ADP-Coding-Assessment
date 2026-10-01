import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { User } from '../types/user'
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

  describe('suggestion pagination', () => {
    const manyUsers: User[] = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      name: `Person ${String(index + 1).padStart(2, '0')}`,
      address: null,
    }))

    it('shows one page of suggestions and appends the next page on load more', async () => {
      const user = userEvent.setup()
      render(<UsersPage status="success" users={manyUsers} source="api" onReload={vi.fn()} />)
      await user.click(screen.getByRole('combobox', { name: 'Search users' }))
      await user.keyboard('{ArrowDown}')
      expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-setsize', '5')
      await user.click(screen.getByRole('button', { name: 'Load more' }))
      expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-setsize', '10')
      await user.click(screen.getByRole('button', { name: 'Load more' }))
      expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-setsize', '12')
      expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
    })

    it('starts again from the first page when the query changes', async () => {
      const user = userEvent.setup()
      render(<UsersPage status="success" users={manyUsers} source="api" onReload={vi.fn()} />)
      const input = screen.getByRole('combobox', { name: 'Search users' })
      await user.click(input)
      await user.keyboard('{ArrowDown}')
      await user.click(screen.getByRole('button', { name: 'Load more' }))
      await user.type(input, 'Person')
      expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-setsize', '5')
    })

    it('fills the input with the selected suggestion and filters the list to it', async () => {
      const user = userEvent.setup()
      render(<UsersPage status="success" users={manyUsers} source="api" onReload={vi.fn()} />)
      const input = screen.getByRole('combobox', { name: 'Search users' })
      await user.type(input, 'Person 0')
      await user.click(screen.getByRole('option', { name: 'Person 03' }))
      expect(input).toHaveValue('Person 03')
      expect(screen.getAllByRole('button', { name: /Person/ })).toHaveLength(1)
    })
  })
})
