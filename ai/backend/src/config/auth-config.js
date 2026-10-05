export const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-in-production'
export const jwtExpiresIn = '7d'
export const userRoles = ['CONSUMER', 'ESTABLISHMENT_ADMIN', 'ESTABLISHMENT_OPERATOR']
