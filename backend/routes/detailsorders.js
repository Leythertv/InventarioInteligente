import express from 'express'
import { pool } from '../db.js'

const router = express.Router()

// Get order details by order ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const result = await pool.request()
      .input('orderId', orderId)
      .query(`
        SELECT d.*, p.NombreProducto, p.Precio
        FROM DetallesPedido d
        JOIN Productos p ON d.ID_Producto = p.ID_Producto
        WHERE d.ID_Pedido = @orderId
      `)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Add product to order
router.post('/', async (req, res) => {
  try {
    const { ID_Pedido, ID_Producto, Cantidad } = req.body
    const result = await pool.request()
      .input('ID_Pedido', ID_Pedido)
      .input('ID_Producto', ID_Producto)
      .input('Cantidad', Cantidad)
      .query(`
        INSERT INTO DetallesPedido (ID_Pedido, ID_Producto, Cantidad, PrecioUnitario, Subtotal)
        SELECT @ID_Pedido, @ID_Producto, @Cantidad, p.Precio, p.Precio * @Cantidad
        FROM Productos p
        WHERE p.ID_Producto = @ID_Producto
      `)
    res.json({ message: 'Product added to order successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update order detail
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { Cantidad } = req.body
    await pool.request()
      .input('id', id)
      .input('Cantidad', Cantidad)
      .query(`
        UPDATE DetallesPedido SET
          Cantidad = @Cantidad,
          Subtotal = PrecioUnitario * @Cantidad
        WHERE ID_DetallePedido = @id
      `)
    res.json({ message: 'Order detail updated successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Remove product from order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.request()
      .input('id', id)
      .query('DELETE FROM DetallesPedido WHERE ID_DetallePedido = @id')
    res.json({ message: 'Product removed from order successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router