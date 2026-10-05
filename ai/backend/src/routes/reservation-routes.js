import { Router } from 'express'
import { listReservations, registerReservation } from '../controllers/reservation-controller.js'
import { requireAuth, requireRole } from '../middlewares/auth-middleware.js'

const reservationRoutes = Router()

reservationRoutes.get('/reservas', requireAuth, listReservations)
reservationRoutes.post('/reservas', requireAuth, requireRole('CONSUMER'), registerReservation)

export default reservationRoutes
