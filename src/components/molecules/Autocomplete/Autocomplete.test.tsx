import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Autocomplete from './Autocomplete'

const NAMES = ['Leanne Graham', 'Ervin Howell', 'Clementine Bauch']

function Harness({ loading = false, disabled = false }: { loading?: boolean; disabled?: boolean }) {
  const [value, setValue] = useState('')
  const options = NAMES.filter((name) => name.toLowerCase().includes(value.toLowerCase()))
  return <Autocomplete label="Search users" value={value} options={options} onValueChange={setValue} loading={loading} disabled={disabled} />
}

describe('Autocomplete', () => {
  it('narrows the suggestions as the user types', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(screen.getByRole('combobox', { name: 'Search users' }), 'ne')
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Leanne Graham', 'Clementine Bauch'])
    await user.type(screen.getByRole('combobox'), ' g')
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('selects a suggestion with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByRole('combobox')
    await user.type(input, 'e')
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    expect(input).toHaveValue('Ervin Howell')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('selects a suggestion with the mouse', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(screen.getByRole('combobox'), 'cle')
    await user.click(screen.getByRole('option', { name: 'Clementine Bauch' }))
    expect(screen.getByRole('combobox')).toHaveValue('Clementine Bauch')
  })

  it('marks the active option and closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByRole('combobox')
    await user.type(input, 'e')
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('option', { name: 'Leanne Graham' })).toHaveAttribute('aria-selected', 'true')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('explains when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByRole('status')).toHaveTextContent('No matches found')
  })

  it('stays usable but reports busy while loading', async () => {
    const user = userEvent.setup()
    render(<Harness loading />)
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-busy', 'true')
    await user.type(input, 'ne')
    expect(input).toHaveValue('ne')
  })

  it('is disabled when disabled', () => {
    render(<Harness disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})

describe('Autocomplete virtualization and load more', () => {
  const manyNames = Array.from({ length: 30 }, (_, index) => `User ${String(index + 1).padStart(2, '0')}`)

  const renderMany = (props: { hasMore?: boolean; loadingMore?: boolean; onLoadMore?: () => void } = {}) =>
    render(<Autocomplete label="Search users" value="" options={manyNames} onValueChange={vi.fn()} {...props} />)

  it('renders only a window of the options while exposing the full set size', async () => {
    const user = userEvent.setup()
    renderMany()
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}')
    const options = screen.getAllByRole('option')
    expect(options.length).toBeLessThan(manyNames.length)
    expect(options[0]).toHaveAttribute('aria-setsize', '30')
    expect(options[0]).toHaveAttribute('aria-posinset', '1')
  })

  it('brings the last option into the rendered window when navigating backwards', async () => {
    const user = userEvent.setup()
    renderMany()
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('option', { name: 'User 30' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByRole('option', { name: 'User 01' })).not.toBeInTheDocument()
  })

  it('offers a load more button only when there are more results', async () => {
    const user = userEvent.setup()
    const { rerender } = renderMany({ hasMore: true, onLoadMore: vi.fn() })
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Load more' })).toBeInTheDocument()
    rerender(<Autocomplete label="Search users" value="" options={manyNames} onValueChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
  })

  it('requests the next page and keeps the list open', async () => {
    const user = userEvent.setup()
    const onLoadMore = vi.fn()
    renderMany({ hasMore: true, onLoadMore })
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}')
    await user.click(screen.getByRole('button', { name: 'Load more' }))
    expect(onLoadMore).toHaveBeenCalledOnce()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps the list open when focus moves to the load more button with the keyboard', async () => {
    const user = userEvent.setup()
    renderMany({ hasMore: true, onLoadMore: vi.fn() })
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Load more' })).toHaveFocus()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  })

  it('disables the load more button while the next page is loading', async () => {
    const user = userEvent.setup()
    renderMany({ hasMore: true, loadingMore: true, onLoadMore: vi.fn() })
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Load more' })).toBeDisabled()
  })
})

