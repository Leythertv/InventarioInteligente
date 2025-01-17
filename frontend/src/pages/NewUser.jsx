import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Check } from 'lucide-react'
import './NewUser.css'

export default function NewUser() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/users', {
        NombreUsuario: data.name,
        CorreoElectronico: data.email,
        Contraseña: data.password
      })
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError('Error al crear la cuenta. Inténtelo de nuevo.')
    }
  }

  return (
    <div className="new-user-container">
      <h1>Crear Nueva Cuenta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="new-user-form">
        <div className="form-group">
          <label>Nombre Completo:</label>
          <div className="input-group">
            <User size={20} className="input-icon" />
            <input
              {...register('name', { required: 'Este campo es obligatorio' })}
              placeholder="Ingrese su nombre completo"
            />
          </div>
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Correo Electrónico:</label>
          <div className="input-group">
            <Mail size={20} className="input-icon" />
            <input
              {...register('email', { 
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido'
                }
              })}
              placeholder="Ingrese su correo electrónico"
            />
          </div>
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              {...register('password', { 
                required: 'Este campo es obligatorio',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres'
                }
              })}
              placeholder="Ingrese su contraseña"
            />
          </div>
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <div className="form-group">
          <label>Confirmar Contraseña:</label>
          <div className="input-group">
            <Check size={20} className="input-icon" />
            <input
              type="password"
              {...register('confirmPassword', {
                validate: value => 
                  value === watch('password') || 'Las contraseñas no coinciden'
              })}
              placeholder="Confirme su contraseña"
            />
          </div>
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && (
          <p className="success-message">
            ¡Cuenta creada exitosamente! Redirigiendo...
          </p>
        )}

        <button type="submit">
          Crear Cuenta
        </button>
      </form>
    </div>
  )
}