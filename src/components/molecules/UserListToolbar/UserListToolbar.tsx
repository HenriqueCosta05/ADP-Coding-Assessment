import Button from '../../atoms/Button/Button'
import styles from './UserListToolbar.module.css'

interface UserListToolbarProps {
  expandedCount: number
  total: number
  disabled?: boolean
  onExpandAll: () => void
  onCollapseAll: () => void
}

function UserListToolbar({ expandedCount, total, disabled = false, onExpandAll, onCollapseAll }: UserListToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <p className={styles.summary} aria-live="polite">
        {expandedCount} of {total} expanded
      </p>
      <div role="group" aria-label="Expand or collapse all users" className={styles.actions}>
        <Button variant="secondary" disabled={disabled || expandedCount === total} onClick={onExpandAll}>
          Expand all
        </Button>
        <Button variant="secondary" disabled={disabled || expandedCount === 0} onClick={onCollapseAll}>
          Collapse all
        </Button>
      </div>
    </div>
  )
}

export default UserListToolbar
