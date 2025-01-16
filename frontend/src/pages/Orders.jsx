import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import BackButton from '../components/BackButton'
import './Orders.css'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({
    ID_Pedido: null,
    ID_Usuario: '',
    ID_Cliente: '',
    FechaPedido: new Date().toISOString().split('T')[0]
  })
  const [clients, setClients] = useState([])
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  // Fetch initial data
  useEffect(() => {
    fetchOrders()
    fetchClients()
    fetchUsers()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      setClients(response.data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const filteredOrders = orders.filter(order =>
    order.RUC.toLowerCase().includes(search.toLowerCase()) ||
    order.NombreCliente.toLowerCase().includes(search.toLowerCase())
  )

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.ID_Pedido) {
        await axios.put(`/api/orders/${formData.ID_Pedido}`, formData)
      } else {
        await axios.post('/api/orders', formData)
      }
      fetchOrders()
      resetForm()
    } catch (error) {
      console.error('Error saving order:', error)
    }
  }

  const handleEdit = (order) => {
    setFormData({
      ID_Pedido: order.ID_Pedido,
      ID_Usuario: order.ID_Usuario,
      ID_Cliente: order.ID_Cliente,
      FechaPedido: order.FechaPedido.split('T')[0]
    })
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/orders/${id}`)
      fetchOrders()
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const handleViewDetails = (orderId) => {
    navigate(`/detailsorders/${orderId}`)
  }

  const resetForm = () => {
    setFormData({
      ID_Pedido: null,
      ID_Usuario: '',
      ID_Cliente: '',
      FechaPedido: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div className="orders-container">
      <BackButton />
      <h1>Gestión de Pedidos</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por RUC o nombre del cliente..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Orders Table */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Cliente</th>
            <th>RUC</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.ID_Pedido}>
              <td>{order.ID_Pedido}</td>
              <td>{order.NombreUsuario}</td>
              <td>{order.NombreCliente}</td>
              <td>{order.RUC}</td>
              <td>{new Date(order.FechaPedido).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(order)}>Editar</button>
                <button onClick={() => handleDelete(order.ID_Pedido)}>Eliminar</button>
                <button
                  onClick={() => handleViewDetails(order.ID_Pedido)}
                  style={{backgroundColor: '#007bff'}}
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Form */}
      <div className="order-form">
        <h2>{formData.ID_Pedido ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario:</label>
            <select
              name="ID_Usuario"
              value={formData.ID_Usuario}
              onChange={handleFormChange}
              required
            >
              <option value="">Seleccionar usuario</option>
              {users.map(user => (
                <option key={user.ID_Usuario} value={user.ID_Usuario}>
                  {user.NombreUsuario}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cliente:</label>
            <select
              name="ID_Cliente"
              value={formData.ID_Cliente}
              onChange={handleFormChange}
              required
            >
              <option value="">Seleccionar cliente</option>
              {clients.map(client => (
                <option key={client.ID_Cliente} value={client.ID_Cliente}>
                  {client.NombreCliente} ({client.RUC})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              name="FechaPedido"
              value={formData.FechaPedido}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={resetForm}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}