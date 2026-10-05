import { Router } from 'express'
import { listEstablishments, registerEstablishment } from '../controllers/establishment-controller.js'
import { requireAuth, requireRole } from '../middlewares/auth-middleware.js'

const establishmentRoutes = Router()

establishmentRoutes.get('/estabelecimentos', listEstablishments)
establishmentRoutes.post('/estabelecimentos', requireAuth, requireRole('ESTABLISHMENT_ADMIN'), registerEstablishment)

export default establishmentRoutes
