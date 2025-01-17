import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import './Login.css'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/auth/login', data)
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(response.data))
      navigate('/dashboard')
    } catch (err) {
      setError('Credenciales inválidas')
    }
  }

  return ( 
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="input-group">
          <Mail size={20} className="input-icon" />
          <input 
            {...register('email')} 
            placeholder="Correo electrónico"
            required
          />
        </div>
        
        <div className="input-group">
          <Lock size={20} className="input-icon" />
          <input 
            {...register('password')} 
            type="password" 
            placeholder="Contraseña"
            required
          />
        </div>
        
        <button type="submit">
          Iniciar Sesión
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </form>
      
      <div className="register-link">
        ¿No tienes una cuenta?{' '}
        <Link to="/new-user">Crear una cuenta</Link>
      </div>
    </div>
  )
}
