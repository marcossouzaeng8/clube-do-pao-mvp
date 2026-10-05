import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { readSession } from '../lib/session'

export function useSchedules() {
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState([])
  const [filter, setFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [busyScheduleId, setBusyScheduleId] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const user = readSession()?.usuario

  const loadSchedules = useCallback(async () => {
    try {
      const data = await api.getSchedules({ status: filter })
      setSchedules(data.fornadas)
    } catch (requestError) {
      setFeedback({ type: 'error', text: requestError.message })
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => { loadSchedules() }, [loadSchedules])

  async function handleReserve(schedule, quantity) {
    if (!user) {
      navigate('/login')
      return
    }

    setBusyScheduleId(schedule.id)
    setFeedback(null)

    try {
      await api.createReservation(schedule.id, quantity)
      setFeedback({ type: 'success', text: `Reserva confirmada: ${quantity}x ${schedule.produto.nome} na ${schedule.estabelecimento.nome}. Pagamento aprovado.` })
    } catch (requestError) {
      setFeedback({ type: 'error', text: requestError.message })
    } finally {
      setBusyScheduleId(null)
      loadSchedules()
    }
  }


  return {
    schedules,
    filter,
    setFilter,
    isLoading,
    busyScheduleId,
    feedback,
    user,
    handleReserve,
  }
}
