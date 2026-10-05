import { Router } from 'express'
import { listSubscriptions, registerSubscription } from '../controllers/subscription-controller.js'
import { requireAuth, requireRole } from '../middlewares/auth-middleware.js'

const subscriptionRoutes = Router()

subscriptionRoutes.get('/assinaturas', requireAuth, listSubscriptions)
subscriptionRoutes.post('/assinaturas', requireAuth, requireRole('CONSUMER'), registerSubscription)

export default subscriptionRoutes
