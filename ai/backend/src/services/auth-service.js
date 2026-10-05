import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtExpiresIn, jwtSecret } from '../config/auth-config.js'

export function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function signToken(user) {
  return jwt.sign({ userId: user.id, email: user.email, role: user.papel }, jwtSecret, { expiresIn: jwtExpiresIn })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret)
  } catch {
    return null
  }
}
