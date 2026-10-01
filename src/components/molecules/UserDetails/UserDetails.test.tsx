import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { users } from '../../../test/fixtures/users'
import UserDetails from './UserDetails'

describe('UserDetails', () => {
  it('shows the address fields and the phone number, and nothing else', () => {
    render(<UserDetails address={users[0].address} phone={users[0].phone} />)
    expect(screen.getByText('Street').nextElementSibling).toHaveTextContent('Kulas Light')
    expect(screen.getByText('Suite').nextElementSibling).toHaveTextContent('Apt. 556')
    expect(screen.getByText('City').nextElementSibling).toHaveTextContent('Gwenborough')
    expect(screen.getByText('Zip code').nextElementSibling).toHaveTextContent('92998-3874')
    expect(screen.getByText('Phone').nextElementSibling).toHaveTextContent('1-770-736-8031 x56442')
    expect(screen.queryByText('Coordinates')).not.toBeInTheDocument()
    expect(screen.getAllByRole('term')).toHaveLength(5)
  })

  it('explains when the address or the phone number is missing', () => {
    render(<UserDetails address={null} phone={null} />)
    expect(screen.getByText('Address').nextElementSibling).toHaveTextContent('Not on file')
    expect(screen.getByText('Phone').nextElementSibling).toHaveTextContent('Not on file')
  })
})
