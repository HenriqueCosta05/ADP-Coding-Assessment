import { useState } from 'react'
import Autocomplete from '../components/molecules/Autocomplete/Autocomplete'
import Notice from '../components/molecules/Notice/Notice'
import Button from '../components/atoms/Button/Button'
import UserList from '../components/organisms/UserList'
import type { UsersSource } from '../hooks/useUsers'
import type { User } from '../types/user'
import { filterUsersByName } from '../utils/filterUsers'
import styles from './UsersPage.module.css'

const MAX_SUGGESTIONS = 8

interface UsersPageProps {
  status: 'loading' | 'success'
  users: readonly User[]
  source: UsersSource | null
  onReload: () => void
}

function UsersPage({ status, users, source, onReload }: UsersPageProps) {
  const [query, setQuery] = useState('')
  const isLoading = status === 'loading'
  const matches = filterUsersByName(users, query)
  const suggestions = [...new Set(matches.map((user) => user.name))].slice(0, MAX_SUGGESTIONS)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <p className={styles.description}>Select a name to see the address on file. Open several at once to compare them.</p>
      </header>
      {source === 'mock' ? (
        <Notice
          title="Showing sample data"
          description="The users API didn't respond, so these are example records."
          action={
            <Button variant="secondary" onClick={onReload}>
              Try again
            </Button>
          }
        />
      ) : null}
      <Autocomplete
        label="Search users"
        placeholder="Type a name"
        value={query}
        options={suggestions}
        loading={isLoading}
        emptyMessage="No users match your search"
        onValueChange={setQuery}
      />
      {isLoading ? <UserList status="loading" /> : <UserList status="success" users={matches} query={query} />}
    </main>
  )
}

export default UsersPage
