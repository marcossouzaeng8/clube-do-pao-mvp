import { verifyToken } from '../services/auth-service.js'

export function requireAuth(request, response, next) {
  const header = request.headers.authorization ?? ''
  const session = header.startsWith('Bearer ') ? verifyToken(header.slice(7)) : null

  if (!session) {
    response.status(401).json({ error: 'Nao autorizado.' })
    return
  }

  request.user = session
  next()
}

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      response.status(403).json({ error: 'Permissao negada.' })
      return
    }

    next()
  }
}

export const requireStaff = requireRole('ESTABLISHMENT_ADMIN', 'ESTABLISHMENT_OPERATOR')
