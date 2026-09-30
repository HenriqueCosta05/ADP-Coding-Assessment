import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
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

  it('is disabled while loading or when disabled', () => {
    const { rerender } = render(<Harness loading />)
    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-busy', 'true')
    rerender(<Harness disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})
