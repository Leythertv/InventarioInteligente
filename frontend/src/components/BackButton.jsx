import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './BackButton.css'

const BackButton = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <button 
      className="back-button" 
      onClick={handleBack}
      aria-label="Volver atrás"
    >
      <ArrowLeft className="back-icon" size={24} />
    </button>
  )
}

export default BackButton