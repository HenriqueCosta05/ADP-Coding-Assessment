import UserList, { type UserListProps } from '../components/organisms/UserList'
import styles from './UsersPage.module.css'

function UsersPage(props: UserListProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <p className={styles.description}>Select a name to see the address on file. Open several at once to compare them.</p>
      </header>
      <UserList {...props} />
    </main>
  )
}

export default UsersPage
