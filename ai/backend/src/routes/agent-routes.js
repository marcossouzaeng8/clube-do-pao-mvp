import { Router } from 'express'
import { findBestMatch, optimizeRoute, predictDemand, suggestUpsell } from '../controllers/agent-controller.js'
import { requireAuth, requireStaff } from '../middlewares/auth-middleware.js'

const agentRoutes = Router()

agentRoutes.post('/agentes/matchmaking', requireAuth, findBestMatch)
agentRoutes.post('/agentes/previsao-demanda', requireAuth, requireStaff, predictDemand)
agentRoutes.post('/agentes/rotas', requireAuth, requireStaff, optimizeRoute)
agentRoutes.post('/agentes/retencao', requireAuth, requireStaff, suggestUpsell)

export default agentRoutes
