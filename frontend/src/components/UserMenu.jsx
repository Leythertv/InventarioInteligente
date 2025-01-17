import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle, LogOut } from 'lucide-react'
import './UserMenu.css'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className={`user-menu ${isOpen ? 'open' : ''}`}>
      <button 
        className="user-icon" 
        onClick={toggleMenu}
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
      >
        <UserCircle size={28} />
      </button>
      
      <div className="menu-content">
        <button 
          className="menu-item" 
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        >
          <LogOut className="menu-icon" size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}

export default UserMenu