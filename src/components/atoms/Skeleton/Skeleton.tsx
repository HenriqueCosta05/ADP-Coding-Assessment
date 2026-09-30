import styles from './Skeleton.module.css'

interface SkeletonProps {
  variant?: 'text' | 'block'
  width?: string
}

function Skeleton({ variant = 'text', width }: SkeletonProps) {
  return <span aria-hidden="true" className={styles.skeleton} data-variant={variant} style={width ? { width } : undefined} />
}

export default Skeleton
