import { Router } from 'express'
import { changeScheduleStatus, listSchedules, registerSchedule } from '../controllers/schedule-controller.js'
import { requireAuth, requireStaff } from '../middlewares/auth-middleware.js'

const scheduleRoutes = Router()

scheduleRoutes.get('/fornadas', listSchedules)
scheduleRoutes.post('/fornadas', requireAuth, requireStaff, registerSchedule)
scheduleRoutes.patch('/fornadas/:id', requireAuth, requireStaff, changeScheduleStatus)

export default scheduleRoutes
