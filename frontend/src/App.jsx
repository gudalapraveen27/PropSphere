import { Outlet } from 'react-router-dom'
import './App.css'
import Nav from './components/navbar/Nav'
import User from './components/users/User'
import { useSelector } from 'react-redux'

function App() {

  const token = useSelector((state) => state.uReducer.token)

  return (
    <div>
      <Nav></Nav>
      {token && <User></User>}
      {!token && <Outlet></Outlet>}
    </div>
  )
}

export default App
