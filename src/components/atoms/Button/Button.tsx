import type { ComponentProps } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends Omit<ComponentProps<'button'>, 'type'> {
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

function Button({ variant = 'primary', loading = false, disabled, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type="button"
      className={styles.button}
      data-variant={variant}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  )
}

export default Button
