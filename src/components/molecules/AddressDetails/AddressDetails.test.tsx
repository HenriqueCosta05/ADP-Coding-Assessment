import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { users } from '../../../test/fixtures/users'
import AddressDetails from './AddressDetails'

describe('AddressDetails', () => {
  it('renders each address field with its label', () => {
    render(<AddressDetails address={users[0].address} />)
    expect(screen.getByText('Street').nextElementSibling).toHaveTextContent('Kulas Light')
    expect(screen.getByText('Zip code').nextElementSibling).toHaveTextContent('92998-3874')
    expect(screen.getByText('Coordinates').nextElementSibling).toHaveTextContent('-37.3159, 81.1496')
  })

  it('explains when a user has no address', () => {
    render(<AddressDetails address={null} />)
    expect(screen.getByText('No address on file.')).toBeInTheDocument()
  })
})
