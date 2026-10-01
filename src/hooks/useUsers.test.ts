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

  it('optimistically shows sample users while the request is pending', () => {
    stubFetchJson(users)
    const { result } = renderHook(() => useUsers())
    expect(result.current).toMatchObject({ isPending: true, source: null })
    expect(result.current.users).toBe(mockUsers)
  })

  it('replaces the optimistic users with the ones returned by the API', async () => {
    stubFetchJson(users)
    const { result } = renderHook(() => useUsers())
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.source).toBe('api')
    expect(result.current.users).toHaveLength(users.length)
    expect(result.current.users[0].name).toBe('Leanne Graham')
  })

  it('keeps the sample users when the API is unreachable', async () => {
    stubFetchNetworkError()
    const { result } = renderHook(() => useUsers())
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.source).toBe('mock')
    expect(result.current.users).toBe(mockUsers)
  })

  it('retries on reload and swaps in the API users', async () => {
    stubFetchNetworkError()
    const { result } = renderHook(() => useUsers())
    await waitFor(() => expect(result.current.source).toBe('mock'))

    stubFetchJson(users)
    act(() => result.current.reload())
    await waitFor(() => expect(result.current.source).toBe('api'))
    expect(result.current.users[0].name).toBe('Leanne Graham')
  })
})
