import type { ComponentProps } from 'react'
import styles from './DisclosureButton.module.css'

interface DisclosureButtonProps extends Omit<ComponentProps<'button'>, 'type' | 'aria-expanded' | 'aria-controls'> {
  expanded: boolean
  controlsId: string
}

function DisclosureButton({ expanded, controlsId, children, ...rest }: DisclosureButtonProps) {
  return (
    <button {...rest} type="button" className={styles.button} aria-expanded={expanded} aria-controls={controlsId}>
      <span className={styles.label}>{children}</span>
      <svg className={styles.chevron} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export default DisclosureButton
