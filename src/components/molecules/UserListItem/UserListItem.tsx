import { useId } from 'react'
import type { User } from '../../../types/user'
import DisclosureButton from '../../atoms/DisclosureButton/DisclosureButton'
import AddressDetails from '../AddressDetails/AddressDetails'
import styles from './UserListItem.module.css'

interface UserListItemProps {
  user: User
  expanded: boolean
  disabled?: boolean
  onToggle: (id: number) => void
}

function UserListItem({ user, expanded, disabled = false, onToggle }: UserListItemProps) {
  const baseId = useId()
  const toggleId = `${baseId}-toggle`
  const panelId = `${baseId}-panel`

  return (
    <li className={styles.item}>
      <DisclosureButton id={toggleId} expanded={expanded} controlsId={panelId} disabled={disabled} onClick={() => onToggle(user.id)}>
        {user.name}
      </DisclosureButton>
      <div id={panelId} role="region" aria-labelledby={toggleId} hidden={!expanded} className={styles.panel}>
        <AddressDetails address={user.address} />
      </div>
    </li>
  )
}

export default UserListItem
