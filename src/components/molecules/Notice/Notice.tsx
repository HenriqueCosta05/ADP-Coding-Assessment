import type { ReactNode } from 'react'
import Spinner from '../../atoms/Spinner/Spinner'
import styles from './Notice.module.css'

interface NoticeProps {
  title: string
  description?: string
  action?: ReactNode
  loading?: boolean
}

function Notice({ title, description, action, loading = false }: NoticeProps) {
  return (
    <div className={styles.notice} role="status" aria-busy={loading || undefined}>
      {loading ? <Spinner /> : null}
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export default Notice
