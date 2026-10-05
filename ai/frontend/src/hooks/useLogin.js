import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { homePathFor, saveSession } from '../lib/session'

export function useLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
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
      const session = await api.login(form.email, form.senha)
      saveSession(session)
      navigate(homePathFor(session.usuario))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }


  function fillDemoAccount(email) {
    setForm({ email, senha: '123456' })
  }

  return {
    form,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    fillDemoAccount,
  }
}
