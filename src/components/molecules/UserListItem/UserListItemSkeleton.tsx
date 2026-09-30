import Skeleton from '../../atoms/Skeleton/Skeleton'
import styles from './UserListItem.module.css'

interface UserListItemSkeletonProps {
  nameWidth?: string
}

function UserListItemSkeleton({ nameWidth = '50%' }: UserListItemSkeletonProps) {
  return (
    <li className={`${styles.item} ${styles.skeleton}`}>
      <Skeleton width={nameWidth} />
    </li>
  )
}

export default UserListItemSkeleton
