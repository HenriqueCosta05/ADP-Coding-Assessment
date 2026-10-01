import type { User } from '../types/user'

const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const digitsOnly = (value: string) => value.replace(/\D/g, '')

function collectFields(value: unknown, fields: string[] = []): string[] {
  if (typeof value === 'string' || typeof value === 'number') fields.push(normalize(String(value)))
  else if (typeof value === 'object' && value !== null) Object.values(value).forEach((nested) => collectFields(nested, fields))
  return fields
}

function matchesTerm(fields: readonly string[], term: string) {
  const numeric = /^\d+$/.test(term)
  return fields.some((field) => field.includes(term) || (numeric && digitsOnly(field).includes(term)))
}

export function searchUsers(users: readonly User[], query: string): readonly User[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return users

  return users.filter((user) => {
    const searchable = Object.entries(user).filter(([key]) => key !== 'id')
    const fields = collectFields(searchable.map(([, value]) => value))
    return terms.every((term) => matchesTerm(fields, term))
  })
}
