import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ArrowLeft, Printer, Plus, Edit, Trash } from 'lucide-react'
import FacturaPDF from '../components/FacturaPDF'
import BackButton from '../components/BackButton'
import './OrderDetails.css'

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [orderDetails, setOrderDetails] = useState([])
  const [orderInfo, setOrderInfo] = useState(null)
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    ID_Producto: '',
    Cantidad: 1
  })

  // Generar número secuencial único
  const generateSequential = () => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(1000 + Math.random() * 9000)
    return `${year}${month}${day}-${random}`
  }

  // Fetch order details and products
  useEffect(() => {
    fetchOrderDetails()
    fetchProducts()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`/api/detailsorders/${orderId}`)
      setOrderDetails(response.data)
      
      // Obtener información del pedido
      const orderResponse = await axios.get(`/api/orders/${orderId}`)
      setOrderInfo(orderResponse.data)
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/detailsorders', {
        ID_Pedido: orderId,
        ...formData
      })
      fetchOrderDetails()
      setFormData({
        ID_Producto: '',
        Cantidad: 1
      })
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const handleUpdateQuantity = async (detailId, newQuantity) => {
    try {
      await axios.put(`/api/detailsorders/${detailId}`, {
        Cantidad: newQuantity
      })
      fetchOrderDetails()
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleRemoveProduct = async (detailId) => {
    try {
      await axios.delete(`/api/detailsorders/${detailId}`)
      fetchOrderDetails()
    } catch (error) {
      console.error('Error removing product:', error)
    }
  }

  const calculateIVA = (subtotal) => {
    return subtotal * 0.12
  }

  const subtotalAmount = orderDetails.reduce((sum, detail) => sum + detail.Subtotal, 0)
  const ivaAmount = calculateIVA(subtotalAmount)
  const totalAmount = subtotalAmount + ivaAmount

  return (
    <div className="order-details-container">
      <BackButton />
      <h1>Detalles del Pedido #{orderId}</h1>
      
      <div className="actions">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Volver a Pedidos</span>
        </button>
        
        {orderInfo && (
          <PDFDownloadLink
            document={
              <FacturaPDF 
                order={orderInfo}
                details={orderDetails}
                sequential={generateSequential()}
              />
            }
            fileName={`factura_${orderId}.pdf`}
          >
            {({ loading }) => (
              <button className="print-button">
                <Printer size={18} />
                <span>{loading ? 'Generando factura...' : 'Imprimir Factura'}</span>
              </button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {/* Products List */}
      <div className="table-container">
        <table className="order-details-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>IVA (12%)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map(detail => (
              <tr key={detail.ID_DetallePedido}>
                <td>{detail.NombreProducto}</td>
                <td>
                  <input
                    type="number"
                    value={detail.Cantidad}
                    min="1"
                    onChange={(e) => handleUpdateQuantity(detail.ID_DetallePedido, e.target.value)}
                  />
                </td>
                <td>${detail.PrecioUnitario.toFixed(2)}</td>
                <td>${detail.Subtotal.toFixed(2)}</td>
                <td>${calculateIVA(detail.Subtotal).toFixed(2)}</td>
                <td>
                  <button 
                    onClick={() => handleRemoveProduct(detail.ID_DetallePedido)}
                    aria-label="Eliminar producto"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="total-label">Subtotal:</td>
              <td className="total-amount">${subtotalAmount.toFixed(2)}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colSpan="3" className="total-label">IVA (12%):</td>
              <td className="total-amount">${ivaAmount.toFixed(2)}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colSpan="3" className="total-label">Total:</td>
              <td className="total-amount">${totalAmount.toFixed(2)}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Add Product Form */}
      <div className="add-product-form">
        <h2>Agregar Producto</h2>
        <form onSubmit={handleAddProduct}>
          <div className="form-group">
            <label>Producto:</label>
            <select
              name="ID_Producto"
              value={formData.ID_Producto}
              onChange={handleFormChange}
              required
            >
              <option value="">Seleccionar producto</option>
              {products.map(product => (
                <option key={product.ID_Producto} value={product.ID_Producto}>
                  {product.NombreProducto} (${product.Precio.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cantidad:</label>
            <input
              type="number"
              name="Cantidad"
              value={formData.Cantidad}
              min="1"
              onChange={handleFormChange}
              required
            />
          </div>

          <button type="submit">
            <Plus size={16} />
            <span>Agregar Producto</span>
          </button>
        </form>
      </div>
    </div>
  )
}