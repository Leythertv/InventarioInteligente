import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'
import { FaBox, FaClipboardList, FaUsers } from 'react-icons/fa'

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    valorTotalInventario: 0,
    promedioPrecios: 0,
    error: false
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchProductMetrics()
  }, [])

  const fetchProductMetrics = async () => {
    try {
      const response = await axios.get('/api/products/metrics')
      setMetrics({
        totalInventario: response.data.valorTotalInventario,
        promedioPrecios: response.data.promedioPrecios,
        error: response.data.error
      })
    } catch (error) {
      setMetrics(prev => ({
        ...prev,
        error: true
      }))
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value)
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="metrics-section">
        <h2>Métricas de Productos</h2>
        
        {metrics.error ? (
          <p className="error-message">Hubo un error al calcular los datos de productos</p>
        ) : (
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Valor Total del Inventario</h3>
              <p>{formatCurrency(metrics.totalInventario)}</p>
            </div>
            
            <div className="metric-card">
              <h3>Promedio de Precios</h3>
              <p>{formatCurrency(metrics.promedioPrecios)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sección de Navegación Rápida */}
      <div className="quick-nav-section">
        <h2>Acceso Rápido</h2>
        <div className="quick-nav-buttons">
          <button 
            className="nav-button"
            onClick={() => navigate('/products')}
          >
            <FaBox className="nav-icon" />
            <span>Productos</span>
          </button>
          
          <button 
            className="nav-button"
            onClick={() => navigate('/orders')}
          >
            <FaClipboardList className="nav-icon" />
            <span>Pedidos</span>
          </button>

          <button 
            className="nav-button"
            onClick={() => navigate('/clients')}
          >
            <FaUsers className="nav-icon" />
            <span>Clientes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
