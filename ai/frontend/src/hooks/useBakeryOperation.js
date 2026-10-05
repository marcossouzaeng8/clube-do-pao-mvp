import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { formatTime } from '../lib/format'
import { readSession } from '../lib/session'

const agentRunners = {
  demand: api.runDemandPrediction,
  route: api.runRouteOptimization,
  retention: api.runRetention,
}

export function useBakeryOperation() {
  const [establishments, setEstablishments] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [newSchedule, setNewSchedule] = useState({ produto_id: '', horario_previsto: '', quantidade: '20' })
  const [results, setResults] = useState({})
  const [busy, setBusy] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const isAdmin = readSession()?.usuario.papel === 'ESTABLISHMENT_ADMIN'
  const selected = establishments.find((establishment) => establishment.id === selectedId)

  const loadSchedules = useCallback(async () => {
    if (!selectedId) return

    try {
      const data = await api.getSchedules({ establishmentId: selectedId })
      setSchedules(data.fornadas)
    } catch (requestError) {
      setFeedback({ type: 'error', text: requestError.message })
    }
  }, [selectedId])

  useEffect(() => {
    api.getEstablishments()
      .then((data) => {
        setEstablishments(data.estabelecimentos)
        setSelectedId(data.estabelecimentos[0]?.id ?? null)
      })
      .catch((requestError) => setFeedback({ type: 'error', text: requestError.message }))
  }, [])

  useEffect(() => {
    setResults({})
    loadSchedules()
  }, [loadSchedules])

  function handleScheduleChange(event) {
    setNewSchedule((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleEstablishmentCreated(establishment) {
    setEstablishments((current) => [...current, { ...establishment, fornadas: [] }])
    setSelectedId(establishment.id)
    setFeedback({ type: 'success', text: `${establishment.nome} cadastrada. Agora agende a primeira fornada.` })
  }

  async function handleCreateSchedule(event) {
    event.preventDefault()
    setBusy('schedule')
    setFeedback(null)

    try {
      const { fornada } = await api.createSchedule({
        estabelecimento_id: selectedId,
        produto_id: Number(newSchedule.produto_id || selected.produtos[0].id),
        horario_previsto: new Date(newSchedule.horario_previsto).toISOString(),
        quantidade: Number(newSchedule.quantidade),
      })
      setFeedback({ type: 'success', text: `Fornada de ${fornada.produto.nome} agendada para ${formatTime(fornada.horario_previsto)}.` })
      await loadSchedules()
    } catch (requestError) {
      setFeedback({ type: 'error', text: requestError.message })
    } finally {
      setBusy(null)
    }
  }

  async function handleUpdateStatus(schedule, status) {
    setBusy(`schedule-${schedule.id}`)
    setFeedback(null)

    try {
      await api.updateScheduleStatus(schedule.id, status)
      await loadSchedules()
    } catch (requestError) {
      setFeedback({ type: 'error', text: requestError.message })
    } finally {
      setBusy(null)
    }
  }

  async function runAgent(agent) {
    setBusy(agent.id)
    setFeedback(null)

    try {
      const result = await agentRunners[agent.id](selectedId)
      setResults((current) => ({ ...current, [agent.id]: result }))
    } catch (requestError) {
      setFeedback({ type: 'error', text: requestError.message })
    } finally {
      setBusy(null)
    }
  }


  return {
    establishments,
    selectedId,
    setSelectedId,
    selected,
    schedules,
    newSchedule,
    results,
    busy,
    feedback,
    isAdmin,
    handleScheduleChange,
    handleEstablishmentCreated,
    handleCreateSchedule,
    handleUpdateStatus,
    runAgent,
  }
}
