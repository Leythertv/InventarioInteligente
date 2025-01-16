import express from 'express'
import { pool } from '../db.js'

const router = express.Router()

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Usuarios')
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Error al obtener los usuarios' })
  }
})

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Usuarios WHERE ID_Usuario = @id')
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    
    res.json(result.recordset[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ message: 'Error al obtener el usuario' })
  }
})

// Crear nuevo usuario
router.post('/', async (req, res) => {
  const { NombreUsuario, CorreoElectronico, Contraseña } = req.body

  // Validaciones básicas
  if (!NombreUsuario || !CorreoElectronico || !Contraseña) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' })
  }

  if (Contraseña.length < 8) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' })
  }

  try {
    // Verificar si el correo ya existe
    const emailCheck = await pool.request()
      .input('CorreoElectronico', CorreoElectronico)
      .query('SELECT * FROM Usuarios WHERE CorreoElectronico = @CorreoElectronico')

    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' })
    }

    // Crear nuevo usuario
    const result = await pool.request()
      .input('NombreUsuario', NombreUsuario)
      .input('CorreoElectronico', CorreoElectronico)
      .input('Contraseña', Contraseña)
      .query(`
        INSERT INTO Usuarios (NombreUsuario, CorreoElectronico, Contraseña)
        VALUES (@NombreUsuario, @CorreoElectronico, @Contraseña)
      `)

    res.status(201).json({ message: 'Usuario creado exitosamente' })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: 'Error al crear el usuario' })
  }
})

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { NombreUsuario, CorreoElectronico, Contraseña } = req.body

  // Validaciones básicas
  if (!NombreUsuario || !CorreoElectronico) {
    return res.status(400).json({ message: 'Nombre y correo son requeridos' })
  }

  try {
    // Verificar si el usuario existe
    const userCheck = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Usuarios WHERE ID_Usuario = @id')

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Verificar si el nuevo correo ya existe
    if (CorreoElectronico !== userCheck.recordset[0].CorreoElectronico) {
      const emailCheck = await pool.request()
        .input('CorreoElectronico', CorreoElectronico)
        .query('SELECT * FROM Usuarios WHERE CorreoElectronico = @CorreoElectronico')

      if (emailCheck.recordset.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' })
      }
    }

    // Actualizar usuario
    await pool.request()
      .input('id', id)
      .input('NombreUsuario', NombreUsuario)
      .input('CorreoElectronico', CorreoElectronico)
      .input('Contraseña', Contraseña || userCheck.recordset[0].Contraseña)
      .query(`
        UPDATE Usuarios SET
          NombreUsuario = @NombreUsuario,
          CorreoElectronico = @CorreoElectronico,
          Contraseña = @Contraseña
        WHERE ID_Usuario = @id
      `)

    res.json({ message: 'Usuario actualizado exitosamente' })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ message: 'Error al actualizar el usuario' })
  }
})

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    // Verificar si el usuario existe
    const userCheck = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Usuarios WHERE ID_Usuario = @id')

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Eliminar usuario
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Usuarios WHERE ID_Usuario = @id')

    res.json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Error al eliminar el usuario' })
  }
})

export default router
