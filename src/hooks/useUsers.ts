import { useEffect, useState } from 'react'
import { REQUEST_TIMEOUT_MS } from '../config/api'
import { mockUsers } from '../mocks/users'
import { fetchUsers } from '../services/usersApi'
import type { User } from '../types/user'

export type UsersSource = 'api' | 'mock'

interface UsersState {
  status: 'loading' | 'success'
  users: readonly User[]
  source: UsersSource | null
}

const INITIAL_STATE: UsersState = { status: 'loading', users: [], source: null }

export function useUsers() {
  const [state, setState] = useState<UsersState>(INITIAL_STATE)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])

    fetchUsers(signal)
      .then((users): UsersState => ({ status: 'success', users, source: 'api' }))
      .catch((error: unknown): UsersState => {
        console.warn('Users API unavailable, falling back to mock data.', error)
        return { status: 'success', users: mockUsers, source: 'mock' }
      })
      .then((next) => {
        if (!controller.signal.aborted) setState(next)
      })

    return () => controller.abort()
  }, [attempt])

  const reload = () => {
    setState(INITIAL_STATE)
    setAttempt((current) => current + 1)
  }

  return { ...state, reload }
}
