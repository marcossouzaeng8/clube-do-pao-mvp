import { Router } from 'express'
import { login, registerUser } from '../controllers/auth-controller.js'

const authRoutes = Router()

authRoutes.post('/auth/cadastro', registerUser)
authRoutes.post('/auth/login', login)

export default authRoutes
