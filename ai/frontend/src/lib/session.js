const storageKey = 'clube-do-pao:sessao'

export function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey))
  } catch {
    return null
  }
}

export function saveSession(session) {
  window.localStorage.setItem(storageKey, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(storageKey)
}

export function isStaff(user) {
  return user?.papel === 'ESTABLISHMENT_ADMIN' || user?.papel === 'ESTABLISHMENT_OPERATOR'
}

export function homePathFor(user) {
  return isStaff(user) ? '/operacao' : '/mapa'
}
