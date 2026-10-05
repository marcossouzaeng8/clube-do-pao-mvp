import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { pathToFileURL } from 'node:url'
import { initializeDatabase } from './database/database.js'
import agentRoutes from './routes/agent-routes.js'
import authRoutes from './routes/auth-routes.js'
import customerRoutes from './routes/customer-routes.js'
import establishmentRoutes from './routes/establishment-routes.js'
import pcpRoutes from './routes/pcp-routes.js'
import reservationRoutes from './routes/reservation-routes.js'
import scheduleRoutes from './routes/schedule-routes.js'
import subscriptionRoutes from './routes/subscription-routes.js'

export const app = express()
const port = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json())
app.use('/api', customerRoutes)
app.use('/api', pcpRoutes)
app.use('/api', authRoutes)
app.use('/api', establishmentRoutes)
app.use('/api', scheduleRoutes)
app.use('/api', reservationRoutes)
app.use('/api', subscriptionRoutes)
app.use('/api', agentRoutes)

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'clube-do-pao-backend' })
})

export async function startServer() {
  await initializeDatabase()
  return app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`)
  })
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch((error) => {
    console.error('Nao foi possivel iniciar o backend:', error)
    process.exit(1)
  })
}
