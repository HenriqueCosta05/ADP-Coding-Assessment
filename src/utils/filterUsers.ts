import type { User } from '../types/user'

export function filterUsersByName(users: readonly User[], query: string): readonly User[] {
  const needle = query.trim().toLowerCase()
  return needle ? users.filter((user) => user.name.toLowerCase().includes(needle)) : users
}
