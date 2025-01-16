import express from 'express'
import { pool } from '../db.js'

const router = express.Router()

// Get all orders with client and user info
router.get('/', async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT p.*, u.NombreUsuario, c.NombreCliente, c.RUC 
      FROM Pedidos p
      JOIN Usuarios u ON p.ID_Usuario = u.ID_Usuario
      JOIN Clientes c ON p.ID_Cliente = c.ID_Cliente
    `)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT p.*, u.NombreUsuario, c.NombreCliente, c.RUC 
        FROM Pedidos p
        JOIN Usuarios u ON p.ID_Usuario = u.ID_Usuario
        JOIN Clientes c ON p.ID_Cliente = c.ID_Cliente
        WHERE p.ID_Pedido = @id
      `)
    res.json(result.recordset[0] || {})
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Create new order
router.post('/', async (req, res) => {
  try {
    const { ID_Usuario, ID_Cliente, FechaPedido } = req.body
    const result = await pool.request()
      .input('ID_Usuario', ID_Usuario)
      .input('ID_Cliente', ID_Cliente)
      .input('FechaPedido', FechaPedido)
      .query(`
        INSERT INTO Pedidos (ID_Usuario, ID_Cliente, FechaPedido)
        VALUES (@ID_Usuario, @ID_Cliente, @FechaPedido)
        SELECT SCOPE_IDENTITY() AS ID_Pedido
      `)
    res.json({ ID_Pedido: result.recordset[0].ID_Pedido })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { ID_Usuario, ID_Cliente, FechaPedido } = req.body
    await pool.request()
      .input('id', id)
      .input('ID_Usuario', ID_Usuario)
      .input('ID_Cliente', ID_Cliente)
      .input('FechaPedido', FechaPedido)
      .query(`
        UPDATE Pedidos SET
          ID_Usuario = @ID_Usuario,
          ID_Cliente = @ID_Cliente,
          FechaPedido = @FechaPedido
        WHERE ID_Pedido = @id
      `)
    res.json({ message: 'Order updated successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Pedidos WHERE ID_Pedido = @id')
    res.json({ message: 'Order deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
