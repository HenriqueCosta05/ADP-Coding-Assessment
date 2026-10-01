import { useState } from 'react'
import type { User } from '../../types/user'
import Button from '../atoms/Button/Button'
import StatusMessage from '../molecules/StatusMessage/StatusMessage'
import UserListItem from '../molecules/UserListItem/UserListItem'
import UserListItemSkeleton from '../molecules/UserListItem/UserListItemSkeleton'
import UserListToolbar from '../molecules/UserListToolbar/UserListToolbar'
import styles from './UserList.module.css'

export type UserListProps = { disabled?: boolean } & (
  | { status: 'loading' }
  | { status: 'error'; onRetry?: () => void }
  | { status: 'success'; users: readonly User[]; query?: string; pending?: boolean }
)

const SKELETON_WIDTHS = ['48%', '62%', '40%', '55%', '35%']

function UserListSkeleton() {
  return (
    <div role="status">
      <span className={styles.srOnly}>Loading users…</span>
      <ul className={styles.list} aria-hidden="true">
        {SKELETON_WIDTHS.map((width) => (
          <UserListItemSkeleton key={width} nameWidth={width} />
        ))}
      </ul>
    </div>
  )
}

interface ExpandableUserListProps {
  users: readonly User[]
  disabled: boolean
  query: string
  pending: boolean
}

function ExpandableUserList({ users, disabled, query, pending }: ExpandableUserListProps) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(() => new Set())
  const expandedCount = users.filter((user) => expandedIds.has(user.id)).length

  const toggle = (id: number) => {
    const next = new Set(expandedIds)
    if (!next.delete(id)) next.add(id)
    setExpandedIds(next)
  }

  if (users.length === 0) {
    return query ? (
      <StatusMessage variant="empty" title="No matching users" description={`No user name contains “${query}”.`} />
    ) : (
      <StatusMessage variant="empty" title="No users yet" description="Users will appear here once they are added." />
    )
  }

  return (
    <div className={styles.container}>
      <UserListToolbar
        expandedCount={expandedCount}
        total={users.length}
        disabled={disabled}
        onExpandAll={() => setExpandedIds(new Set(users.map((user) => user.id)))}
        onCollapseAll={() => setExpandedIds(new Set())}
      />
      <ul className={styles.list} aria-label="Users" aria-busy={pending || undefined} data-pending={pending}>
        {users.map((user) => (
          <UserListItem key={user.id} user={user} expanded={expandedIds.has(user.id)} disabled={disabled} onToggle={toggle} />
        ))}
      </ul>
    </div>
  )
}

function UserList(props: UserListProps) {
  const { disabled = false } = props

  switch (props.status) {
    case 'loading':
      return <UserListSkeleton />
    case 'error':
      return (
        <StatusMessage
          variant="error"
          title="Couldn't load users"
          description="Check your connection and try again."
          action={props.onRetry ? <Button disabled={disabled} onClick={props.onRetry}>Try again</Button> : undefined}
        />
      )
    case 'success':
      return <ExpandableUserList users={props.users} disabled={disabled} query={props.query?.trim() ?? ''} pending={props.pending ?? false} />
  }
}

export default UserList
