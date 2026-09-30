import './App.css'
import './styles/tokens.css'
import { useUsers } from './hooks/useUsers'
import UsersPage from './pages/UsersPage'

function App() {
  const { status, users, source, reload } = useUsers()
  return <UsersPage status={status} users={users} source={source} onReload={reload} />
}

export default App
