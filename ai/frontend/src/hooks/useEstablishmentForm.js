import { useState } from 'react'
import { api } from '../lib/api'

const emptyEstablishment = { nome: '', endereco: '', telefone: '', lat: '', lng: '', produto: '', preco: '' }

export function useEstablishmentForm(onCreated) {
  const [form, setForm] = useState(emptyEstablishment)
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
      const { produto, preco, ...establishment } = form
      const data = await api.createEstablishment({ ...establishment, produtos: [{ nome: produto, preco: Number(preco) }] })
      setForm(emptyEstablishment)
      onCreated(data.estabelecimento)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }


  return { form, isSubmitting, error, handleChange, handleSubmit }
}
