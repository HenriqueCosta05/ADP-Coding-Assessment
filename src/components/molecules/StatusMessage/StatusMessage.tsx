import type { ReactNode } from 'react'
import styles from './StatusMessage.module.css'

interface StatusMessageProps {
  variant: 'empty' | 'error'
  title: string
  description?: string
  action?: ReactNode
}

function StatusMessage({ variant, title, description, action }: StatusMessageProps) {
  return (
    <div className={styles.message} data-variant={variant} role={variant === 'error' ? 'alert' : 'status'}>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}

export default StatusMessage
