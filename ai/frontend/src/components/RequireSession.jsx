import { Navigate } from 'react-router-dom'
import { homePathFor, readSession } from '../lib/session'

export default function RequireSession({ roles, children }) {
  const user = readSession()?.usuario

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.papel)) return <Navigate to={homePathFor(user)} replace />

  return children
}
