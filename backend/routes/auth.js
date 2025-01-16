import express from 'express'
import { pool } from '../db.js'
import sql from 'mssql'

    const router = express.Router()

    // Login route
    router.post('/login', async (req, res) => {
      const { email, password } = req.body
      
      try {
        const result = await pool.request()
          .input('email', sql.VarChar, email)
          .query('SELECT * FROM Usuarios WHERE CorreoElectronico = @email')

        const user = result.recordset[0]
        
        if (!user) {
          return res.status(400).json({ message: 'User not found' })
        }

        const storedPassword = user.Contraseña.trim()
        const inputPassword = password.trim()
        
        console.log('Stored password:', storedPassword)
        console.log('Input password:', inputPassword)
        
        if (inputPassword !== storedPassword) {
          console.log('Password mismatch')
          return res.status(400).json({ message: 'Invalid credentials' })
        }

        res.json({
          id: user.ID_Usuario,
          name: user.NombreUsuario,
          email: user.CorreoElectronico
        })
      } catch (err) {
        res.status(500).json({ message: 'Server error' })
      }
    })

    export default router
