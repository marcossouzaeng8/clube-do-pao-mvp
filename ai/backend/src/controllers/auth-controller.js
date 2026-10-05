import { userRoles } from '../config/auth-config.js'
import { createUser, findUserByEmail } from '../repositories/user-repository.js'
import { hashPassword, signToken, verifyPassword } from '../services/auth-service.js'

function toSession(user) {
  return {
    token: signToken(user),
    usuario: { id: user.id, email: user.email, nome: user.nome, papel: user.papel },
  }
}

function parseCoordinate(value) {
  const coordinate = Number.parseFloat(value)
  return Number.isFinite(coordinate) ? coordinate : null
}

export async function registerUser(request, response) {
  const { nome, email, senha, papel, endereco, lat, lng } = request.body ?? {}

  if (!nome?.trim() || !email?.trim() || !senha) {
    response.status(400).json({ error: 'Nome, email e senha sao obrigatorios.' })
    return
  }

  try {
    const normalizedEmail = email.trim().toLowerCase()

    if (await findUserByEmail(normalizedEmail)) {
      response.status(409).json({ error: 'Email ja cadastrado.' })
      return
    }

    const user = await createUser({
      email: normalizedEmail,
      senhaHash: await hashPassword(senha),
      nome: nome.trim(),
      papel: userRoles.includes(papel) ? papel : 'CONSUMER',
      endereco: endereco?.trim() || null,
      lat: parseCoordinate(lat),
      lng: parseCoordinate(lng),
    })

    response.status(201).json(toSession(user))
  } catch (error) {
    console.error('Erro ao cadastrar usuario:', error)
    response.status(500).json({ error: 'Nao foi possivel cadastrar o usuario.' })
  }
}

export async function login(request, response) {
  const { email, senha } = request.body ?? {}

  if (!email?.trim() || !senha) {
    response.status(400).json({ error: 'Email e senha sao obrigatorios.' })
    return
  }

  try {
    const user = await findUserByEmail(email.trim().toLowerCase())

    if (!user || !(await verifyPassword(senha, user.senha_hash))) {
      response.status(401).json({ error: 'Credenciais invalidas.' })
      return
    }

    response.json(toSession(user))
  } catch (error) {
    console.error('Erro ao autenticar usuario:', error)
    response.status(500).json({ error: 'Nao foi possivel entrar.' })
  }
}
