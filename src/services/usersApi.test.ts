import { afterEach, describe, expect, it, vi } from 'vitest'
import { USERS_ENDPOINT } from '../config/api'
import { stubFetchJson } from '../test/fetch'
import { fetchUsers } from './usersApi'

const apiUser = {
  id: 7,
  name: 'Kurtis Weissnat',
  address: { street: 'Rex Trail', suite: 'Suite 280', city: 'Howemouth', zipcode: '58804-1099', geo: { lat: '24.8918', lng: '21.8984' } },
}

describe('fetchUsers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the configured endpoint and maps users', async () => {
    stubFetchJson([apiUser])
    const users = await fetchUsers()
    expect(fetch).toHaveBeenCalledWith(USERS_ENDPOINT, expect.objectContaining({ headers: { Accept: 'application/json' } }))
    expect(users).toEqual([apiUser])
  })

  it('keeps a user whose address is malformed, with a null address', async () => {
    stubFetchJson([{ id: 1, name: 'No Address', address: { street: 'Only street' } }])
    await expect(fetchUsers()).resolves.toEqual([{ id: 1, name: 'No Address', address: null }])
  })

  it('rejects on a non-2xx response', async () => {
    stubFetchJson({}, { status: 503 })
    await expect(fetchUsers()).rejects.toThrow('status 503')
  })

  it('rejects when the payload is not an array', async () => {
    stubFetchJson({ users: [] })
    await expect(fetchUsers()).rejects.toThrow('expected an array')
  })

  it('rejects when a user has an unexpected shape', async () => {
    stubFetchJson([{ id: 'one' }])
    await expect(fetchUsers()).rejects.toThrow('Unexpected user shape')
  })
})
