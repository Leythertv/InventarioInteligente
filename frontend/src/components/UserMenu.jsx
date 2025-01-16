import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
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
      <button className="user-icon" onClick={toggleMenu}>
        <FaUserCircle size={28} />
      </button>
      
      <div className="menu-content">
        <button className="menu-item" onClick={handleLogout}>
          <FaSignOutAlt className="menu-icon" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}

export default UserMenu