import type { Address } from '../../../types/user'
import styles from './AddressDetails.module.css'

interface AddressDetailsProps {
  address: Address | null
}

function AddressDetails({ address }: AddressDetailsProps) {
  if (!address) {
    return <p className={styles.empty}>No address on file.</p>
  }

  const rows = [
    ['Street', address.street],
    ['Suite', address.suite],
    ['City', address.city],
    ['Zip code', address.zipcode],
    ['Coordinates', `${address.geo.lat}, ${address.geo.lng}`],
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

export default AddressDetails
