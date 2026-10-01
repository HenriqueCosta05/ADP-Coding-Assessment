import { describe, expect, it } from 'vitest'
import { users } from '../test/fixtures/users'
import { searchUsers } from './searchUsers'

const names = (query: string) => searchUsers(users, query).map((user) => user.name)

describe('searchUsers', () => {
  it('returns every user for an empty or blank query', () => {
    expect(searchUsers(users, '')).toBe(users)
    expect(searchUsers(users, '   ')).toBe(users)
  })

  it('matches the name regardless of case', () => {
    expect(names('LEANNE')).toEqual(['Leanne Graham'])
  })

  it.each([
    ['street', 'victor plains', 'Ervin Howell'],
    ['suite', 'apt. 556', 'Leanne Graham'],
    ['city', 'wisoky', 'Ervin Howell'],
    ['zip code', '92998', 'Leanne Graham'],
    ['phone', 'x56442', 'Leanne Graham'],
  ])('matches the %s', (_field, query, expected) => {
    expect(names(query)).toEqual([expected])
  })

  it('matches a phone number typed without punctuation', () => {
    expect(names('7707368031')).toEqual(['Leanne Graham'])
  })

  it('requires every word to match, in any field', () => {
    expect(names('leanne gwenborough')).toEqual(['Leanne Graham'])
    expect(names('leanne wisokyburgh')).toEqual([])
  })

  it('ignores accents and does not search the id', () => {
    expect(searchUsers([{ id: 7, name: 'João Pereira', address: null, phone: null }], 'joao')).toHaveLength(1)
    expect(searchUsers([{ id: 99999, name: 'Zed', address: null, phone: null }], '99999')).toEqual([])
  })

  it('returns nothing when no field matches', () => {
    expect(names('zzz')).toEqual([])
  })
})
