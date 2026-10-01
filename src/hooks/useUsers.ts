import { startTransition, useEffect, useOptimistic, useState, useTransition } from 'react'
import { REQUEST_TIMEOUT_MS } from '../config/api'
import { mockUsers } from '../mocks/users'
import { fetchUsers } from '../services/usersApi'
import type { User } from '../types/user'

export type UsersSource = 'api' | 'mock'

interface LoadedUsers {
  users: readonly User[]
  source: UsersSource | null
}

const NOT_LOADED: LoadedUsers = { users: [], source: null }

async function loadUsers(signal: AbortSignal): Promise<LoadedUsers> {
  try {
    return { users: await fetchUsers(signal), source: 'api' }
  } catch (error) {
    console.warn('Users API unavailable, falling back to mock data.', error)
    return { users: mockUsers, source: 'mock' }
  }
}

export function useUsers() {
  const [loaded, setLoaded] = useState(NOT_LOADED)
  const [attempt, setAttempt] = useState(0)
  const [isPending, startLoading] = useTransition()
  const [users, seedUsers] = useOptimistic(loaded.users, (current, seed: readonly User[]) => (current.length > 0 ? current : seed))

  useEffect(() => {
    const controller = new AbortController()
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])

    startLoading(async () => {
      seedUsers(mockUsers)
      const next = await loadUsers(signal)
      if (!controller.signal.aborted) startTransition(() => setLoaded(next))
    })

    return () => controller.abort()
  }, [attempt, seedUsers, startLoading])

  const reload = () => setAttempt((current) => current + 1)

  return { users, source: loaded.source, isPending, reload }
}
