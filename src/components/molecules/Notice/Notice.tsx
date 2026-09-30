import type { ReactNode } from 'react'
import styles from './Notice.module.css'

interface NoticeProps {
  title: string
  description?: string
  action?: ReactNode
}

function Notice({ title, description, action }: NoticeProps) {
  return (
    <div className={styles.notice} role="status">
      <div>
        <p className={styles.title}>{title}</p>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export default Notice
