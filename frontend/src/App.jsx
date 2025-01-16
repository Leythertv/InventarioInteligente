import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Users from './pages/Users.jsx'
import Clients from './pages/Clients.jsx'
import Products from './pages/Products.jsx'
import Orders from './pages/Orders.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import NewUser from './pages/NewUser.jsx'
import UserMenu from './components/UserMenu.jsx'

function App() {
  const user = JSON.parse(localStorage.getItem('user'))
  const location = useLocation()
  const showUserMenu = user && !['/', '/new-user'].includes(location.pathname)

  return (
    <>
      {showUserMenu && <UserMenu />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/detailsorders/:orderId" element={<OrderDetails />} />
        <Route path="/new-user" element={<NewUser />} />
      </Routes>
    </>
  )
}

export default App
