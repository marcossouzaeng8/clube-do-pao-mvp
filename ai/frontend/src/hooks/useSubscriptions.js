import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { formatCurrency } from '../lib/format'

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [establishments, setEstablishments] = useState([])
  const [selectedEstablishment, setSelectedEstablishment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [busyPlan, setBusyPlan] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    Promise.all([api.getSubscriptions(), api.getEstablishments()])
      .then(([subscriptionData, establishmentData]) => {
        setSubscriptions(subscriptionData.assinaturas)
        setEstablishments(establishmentData.estabelecimentos)
        setSelectedEstablishment(String(establishmentData.estabelecimentos[0]?.id ?? ''))
      })
      .catch((requestError) => setFeedback({ type: 'error', text: requestError.message }))
      .finally(() => setIsLoading(false))
  }, [])

  async function subscribe(plan) {
    setBusyPlan(plan.id)
    setFeedback(null)

    try {
      const { assinatura } = await api.createSubscription(Number(selectedEstablishment), plan.id)
      setSubscriptions((current) => [assinatura, ...current])
      setFeedback({ type: 'success', text: `Assinatura ${plan.name} ativa! Você ganhou ${formatCurrency(assinatura.saldo_cashback)} de cashback.` })
    } catch (requestError) {
      setFeedback({ type: 'error', text: requestError.message })
    } finally {
      setBusyPlan(null)
    }
  }


  return {
    subscriptions,
    establishments,
    selectedEstablishment,
    setSelectedEstablishment,
    isLoading,
    busyPlan,
    feedback,
    subscribe,
  }
}
