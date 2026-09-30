import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockUsers } from '../mocks/users'
import { stubFetchJson, stubFetchNetworkError } from '../test/fetch'
import { users } from '../test/fixtures/users'
import { useUsers } from './useUsers'

describe('useUsers', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('starts in the loading state', () => {
    stubFetchJson(users)
    const { result } = renderHook(() => useUsers())
    expect(result.current).toMatchObject({ status: 'loading', users: [], source: null })
  })

  it('exposes the users returned by the API', async () => {
    stubFetchJson(users)
    const { result } = renderHook(() => useUsers())
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.source).toBe('api')
    expect(result.current.users).toHaveLength(users.length)
  })

  it('falls back to mock users when the API is unreachable', async () => {
    stubFetchNetworkError()
    const { result } = renderHook(() => useUsers())
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.source).toBe('mock')
    expect(result.current.users).toBe(mockUsers)
  })

  it('retries the request on reload', async () => {
    stubFetchNetworkError()
    const { result } = renderHook(() => useUsers())
    await waitFor(() => expect(result.current.source).toBe('mock'))

    stubFetchJson(users)
    act(() => result.current.reload())
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.source).toBe('api'))
  })
})
