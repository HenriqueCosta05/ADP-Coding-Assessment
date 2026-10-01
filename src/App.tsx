import './App.css'
import './styles/palette.css'
import './styles/tokens.css'
import { useUsers } from './hooks/useUsers'
import UsersPage from './pages/UsersPage'

function App() {
  const { users, source, isPending, reload } = useUsers()
  return <UsersPage users={users} source={source} isPending={isPending} onReload={reload} />
}

export default App
