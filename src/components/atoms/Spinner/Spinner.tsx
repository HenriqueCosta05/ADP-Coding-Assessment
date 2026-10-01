import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: 'sm' | 'md'
}

function Spinner({ size = 'md' }: SpinnerProps) {
  return <span aria-hidden="true" className={styles.spinner} data-size={size} />
}

export default Spinner
