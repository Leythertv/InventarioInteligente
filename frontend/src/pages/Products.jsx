import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import '../pages/Products.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    NombreProducto: '',
    Descripcion: '',
    Precio: '',
    CantidadStock: ''
  })
  const [editMode, setEditMode] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editMode) {
        await axios.put(`/api/products/${currentProductId}`, formData)
      } else {
        await axios.post('/api/products', formData)
      }
      
      setFormData({
        NombreProducto: '',
        Descripcion: '',
        Precio: '',
        CantidadStock: ''
      })
      setEditMode(false)
      setCurrentProductId(null)
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product) => {
    setFormData({
      NombreProducto: product.NombreProducto,
      Descripcion: product.Descripcion,
      Precio: product.Precio,
      CantidadStock: product.CantidadStock
    })
    setEditMode(true)
    setCurrentProductId(product.ID_Producto)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <div className="products-container">
      <BackButton />
      <h1>Gestión de Productos</h1>
      
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="NombreProducto"
          placeholder="Nombre del Producto"
          value={formData.NombreProducto}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="Descripcion"
          placeholder="Descripción"
          value={formData.Descripcion}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="Precio"
          placeholder="Precio"
          value={formData.Precio}
          onChange={handleInputChange}
          step="0.01"
          required
        />
        <input
          type="number"
          name="CantidadStock"
          placeholder="Cantidad en Stock"
          value={formData.CantidadStock}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {editMode ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </form>

      <div className="products-list">
        {products.map(product => (
          <div key={product.ID_Producto} className="product-card">
            <h3>{product.NombreProducto}</h3>
            <p>{product.Descripcion}</p>
            <p>Precio: ${product.Precio}</p>
            <p>Stock: {product.CantidadStock}</p>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)}>Editar</button>
              <button onClick={() => handleDelete(product.ID_Producto)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
