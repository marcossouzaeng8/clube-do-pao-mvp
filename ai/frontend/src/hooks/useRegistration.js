import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { homePathFor, saveSession } from '../lib/session'

function getCurrentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => resolve(null),
      { timeout: 4000 },
    )
  })
}

export function useRegistration() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '', papel: 'CONSUMER', endereco: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // A localização do consumidor vira a parada dele na rota de entregas.
      const position = form.papel === 'CONSUMER' ? await getCurrentPosition() : null
      const session = await api.register({ ...form, ...position })
      saveSession(session)
      navigate(homePathFor(session.usuario))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }


  return {
    form,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
  }
}
