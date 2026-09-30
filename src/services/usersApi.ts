import { USERS_ENDPOINT } from '../config/api'
import type { Address, User } from '../types/user'

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const isString = (value: unknown): value is string => typeof value === 'string'

function toAddress(raw: unknown): Address | null {
  if (!isRecord(raw) || !isRecord(raw.geo)) return null
  const { street, suite, city, zipcode } = raw
  const { lat, lng } = raw.geo
  if (!isString(street) || !isString(suite) || !isString(city) || !isString(zipcode) || !isString(lat) || !isString(lng)) return null
  return { street, suite, city, zipcode, geo: { lat, lng } }
}

function toUser(raw: unknown): User {
  if (!isRecord(raw) || typeof raw.id !== 'number' || !isString(raw.name)) {
    throw new Error('Unexpected user shape in API response')
  }
  return { id: raw.id, name: raw.name, address: toAddress(raw.address) }
}

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  const response = await fetch(USERS_ENDPOINT, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Users request failed with status ${response.status}`)

  const payload: unknown = await response.json()
  if (!Array.isArray(payload)) throw new Error('Unexpected users payload: expected an array')
  return payload.map(toUser)
}
