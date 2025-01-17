import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Edit, Trash } from 'lucide-react'
import BackButton from '../components/BackButton'
import './Clients.css'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentClient, setCurrentClient] = useState(null)
  const [formData, setFormData] = useState({
    RUC: '',
    NombreCliente: '',
    Direccion: '',
    Telefono: '',
    CorreoElectronico: ''
  })

  // Obtener clientes
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  // Manejar búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredClients = clients.filter(client =>
    client.NombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.RUC.includes(searchTerm)
  )

  // Manejar formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Abrir modal para crear/editar
  const openModal = (client = null) => {
    setCurrentClient(client)
    setFormData(client ? { ...client } : {
      RUC: '',
      NombreCliente: '',
      Direccion: '',
      Telefono: '',
      CorreoElectronico: ''
    })
    setShowModal(true)
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const url = currentClient ? `/api/clients/${currentClient.ID_Cliente}` : '/api/clients'
    const method = currentClient ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchClients()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error saving client:', error)
    }
  }

  // Eliminar cliente
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          fetchClients()
        }
      } catch (error) {
        console.error('Error deleting client:', error)
      }
    }
  }

  return (
    <div className="clients-container">
      <BackButton />
      <h1>Gestión de Clientes</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar cliente por nombre o RUC..."
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Buscar clientes"
        />
        <button 
          onClick={() => openModal()}
          aria-label="Agregar nuevo cliente"
        >
          <Plus size={18} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>RUC</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.ID_Cliente}>
                <td>{client.RUC}</td>
                <td>{client.NombreCliente}</td>
                <td>{client.Direccion}</td>
                <td>{client.Telefono}</td>
                <td>{client.CorreoElectronico}</td>
                <td className="action-buttons">
                  <button 
                    className="edit-btn" 
                    onClick={() => openModal(client)}
                    aria-label={`Editar ${client.NombreCliente}`}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(client.ID_Cliente)}
                    aria-label={`Eliminar ${client.NombreCliente}`}
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{currentClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>RUC:</label>
                <input
                  type="text"
                  name="RUC"
                  value={formData.RUC}
                  onChange={handleInputChange}
                  required
                  aria-label="RUC del cliente"
                />
              </div>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="NombreCliente"
                  value={formData.NombreCliente}
                  onChange={handleInputChange}
                  required
                  aria-label="Nombre del cliente"
                />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  name="Direccion"
                  value={formData.Direccion}
                  onChange={handleInputChange}
                  aria-label="Dirección del cliente"
                />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="text"
                  name="Telefono"
                  value={formData.Telefono}
                  onChange={handleInputChange}
                  aria-label="Teléfono del cliente"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="CorreoElectronico"
                  value={formData.CorreoElectronico}
                  onChange={handleInputChange}
                  aria-label="Email del cliente"
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                  aria-label="Cancelar"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  aria-label="Guardar cliente"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
