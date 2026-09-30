import { vi } from 'vitest'

export const stubFetchJson = (payload: unknown, init?: ResponseInit) =>
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify(payload), init))))

export const stubFetchNetworkError = () =>
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))))
