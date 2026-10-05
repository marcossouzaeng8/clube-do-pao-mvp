import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export function useReservations() {
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getReservations()
      .then((data) => setReservations(data.reservas))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false))
  }, [])


  return {
    reservations,
    isLoading,
    error,
  }
}
