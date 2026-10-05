import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { readSession } from '../lib/session'

// Região das padarias de demonstração (São Paulo), usada quando não há localização ou padaria por perto.
const demoCenter = { lat: -23.5505, lng: -46.6333 }
const radiusKm = 10

export function useNearbyBakeries() {
  const [origin, setOrigin] = useState(demoCenter)
  const [establishments, setEstablishments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMatching, setIsMatching] = useState(false)
  const [match, setMatch] = useState(undefined)
  const [feedback, setFeedback] = useState(null)
  const isLoggedIn = Boolean(readSession())
  const isDemoRegion = origin === demoCenter

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {},
    )
  }, [])

  useEffect(() => {
    let isCurrent = true

    api.getEstablishments({ ...origin, raio: radiusKm })
      .then((data) => {
        if (!isCurrent) return

        if (data.estabelecimentos.length === 0 && origin !== demoCenter) {
          setOrigin(demoCenter)
          return
        }

        setEstablishments(data.estabelecimentos)
        setIsLoading(false)
      })
      .catch((requestError) => {
        if (!isCurrent) return
        setFeedback({ type: 'error', text: requestError.message })
        setIsLoading(false)
      })

    return () => { isCurrent = false }
  }, [origin])

  async function findHotBread() {
    setIsMatching(true)
    setFeedback(null)

    try {
      const result = await api.runMatchmaking({ ...origin, raioKm: radiusKm })
      setMatch(result.melhor_match)
    } catch (requestError) {
      setFeedback({ type: 'error', text: requestError.message })
    } finally {
      setIsMatching(false)
    }
  }


  return {
    origin,
    establishments,
    isLoading,
    isMatching,
    match,
    feedback,
    isLoggedIn,
    isDemoRegion,
    radiusKm,
    findHotBread,
  }
}
