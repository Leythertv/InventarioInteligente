import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa'
import './BackButton.css'

const BackButton = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <button className="back-button" onClick={handleBack}>
      <FaChevronLeft className="back-icon" />
    </button>
  )
}

export default BackButton