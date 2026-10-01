import type { User } from '../../../types/user'
import styles from './UserDetails.module.css'

interface UserDetailsProps {
  address: User['address']
  phone: User['phone']
}

const NOT_ON_FILE = 'Not on file'

function UserDetails({ address, phone }: UserDetailsProps) {
  const rows = [
    ...(address
      ? [
          ['Street', address.street],
          ['Suite', address.suite],
          ['City', address.city],
          ['Zip code', address.zipcode],
        ]
      : [['Address', NOT_ON_FILE]]),
    ['Phone', phone ?? NOT_ON_FILE],
  ]

  return (
    <dl className={styles.details}>
      {rows.map(([term, value]) => (
        <div key={term} className={styles.row}>
          <dt className={styles.term}>{term}</dt>
          <dd className={styles.value}>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default UserDetails
