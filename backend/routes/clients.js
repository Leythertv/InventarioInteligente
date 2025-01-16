import express from 'express'
import { pool } from '../db.js'

const router = express.Router()

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Clientes')
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching clients:', error)
    res.status(500).json({ message: 'Error al obtener los clientes' })
  }
})

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Clientes WHERE ID_Cliente = @id')
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' })
    }
    
    res.json(result.recordset[0])
  } catch (error) {
    console.error('Error fetching client:', error)
    res.status(500).json({ message: 'Error al obtener el cliente' })
  }
})

// Crear nuevo cliente
router.post('/', async (req, res) => {
  const { RUC, NombreCliente, Direccion, Telefono, CorreoElectronico } = req.body

  // Validaciones básicas
  if (!RUC || !NombreCliente) {
    return res.status(400).json({ message: 'RUC y Nombre son requeridos' })
  }

  try {
    // Verificar si el RUC ya existe
    const rucCheck = await pool.request()
      .input('RUC', RUC)
      .query('SELECT * FROM Clientes WHERE RUC = @RUC')

    if (rucCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'El RUC ya está registrado' })
    }

    // Crear nuevo cliente
    const result = await pool.request()
      .input('RUC', RUC)
      .input('NombreCliente', NombreCliente)
      .input('Direccion', Direccion || null)
      .input('Telefono', Telefono || null)
      .input('CorreoElectronico', CorreoElectronico || null)
      .query(`
        INSERT INTO Clientes (RUC, NombreCliente, Direccion, Telefono, CorreoElectronico)
        VALUES (@RUC, @NombreCliente, @Direccion, @Telefono, @CorreoElectronico)
      `)

    res.status(201).json({ message: 'Cliente creado exitosamente' })
  } catch (error) {
    console.error('Error creating client:', error)
    res.status(500).json({ message: 'Error al crear el cliente' })
  }
})

// Actualizar cliente
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { RUC, NombreCliente, Direccion, Telefono, CorreoElectronico } = req.body

  // Validaciones básicas
  if (!RUC || !NombreCliente) {
    return res.status(400).json({ message: 'RUC y Nombre son requeridos' })
  }

  try {
    // Verificar si el cliente existe
    const clientCheck = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Clientes WHERE ID_Cliente = @id')

    if (clientCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' })
    }

    // Verificar si el nuevo RUC ya existe
    if (RUC !== clientCheck.recordset[0].RUC) {
      const rucCheck = await pool.request()
        .input('RUC', RUC)
        .query('SELECT * FROM Clientes WHERE RUC = @RUC')

      if (rucCheck.recordset.length > 0) {
        return res.status(400).json({ message: 'El RUC ya está registrado' })
      }
    }

    // Actualizar cliente
    await pool.request()
      .input('id', id)
      .input('RUC', RUC)
      .input('NombreCliente', NombreCliente)
      .input('Direccion', Direccion || null)
      .input('Telefono', Telefono || null)
      .input('CorreoElectronico', CorreoElectronico || null)
      .query(`
        UPDATE Clientes SET
          RUC = @RUC,
          NombreCliente = @NombreCliente,
          Direccion = @Direccion,
          Telefono = @Telefono,
          CorreoElectronico = @CorreoElectronico
        WHERE ID_Cliente = @id
      `)

    res.json({ message: 'Cliente actualizado exitosamente' })
  } catch (error) {
    console.error('Error updating client:', error)
    res.status(500).json({ message: 'Error al actualizar el cliente' })
  }
})

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    // Verificar si el cliente existe
    const clientCheck = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Clientes WHERE ID_Cliente = @id')

    if (clientCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' })
    }

    // Eliminar cliente
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Clientes WHERE ID_Cliente = @id')

    res.json({ message: 'Cliente eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting client:', error)
    res.status(500).json({ message: 'Error al eliminar el cliente' })
  }
})

export default router
