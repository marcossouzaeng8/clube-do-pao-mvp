export const marketplaceTables = [
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    nome TEXT NOT NULL,
    papel TEXT NOT NULL DEFAULT 'CONSUMER',
    endereco TEXT,
    lat REAL,
    lng REAL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS estabelecimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    telefone TEXT,
    admin_usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estabelecimento_id INTEGER NOT NULL REFERENCES estabelecimentos(id),
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'pao'
  )`,
  `CREATE TABLE IF NOT EXISTS fornadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estabelecimento_id INTEGER NOT NULL REFERENCES estabelecimentos(id),
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    horario_previsto TEXT NOT NULL,
    pronto_em TEXT,
    quantidade INTEGER NOT NULL,
    disponivel INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'SCHEDULED',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS assinaturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    estabelecimento_id INTEGER NOT NULL REFERENCES estabelecimentos(id),
    plano TEXT NOT NULL,
    preco REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    saldo_cashback REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    metodo TEXT NOT NULL DEFAULT 'card',
    status TEXT NOT NULL DEFAULT 'PENDING',
    tipo TEXT NOT NULL,
    id_externo TEXT,
    assinatura_id INTEGER REFERENCES assinaturas(id),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    fornada_id INTEGER NOT NULL REFERENCES fornadas(id),
    quantidade INTEGER NOT NULL,
    valor_total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    pagamento_id INTEGER REFERENCES pagamentos(id),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS rotas_entrega (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estabelecimento_id INTEGER NOT NULL REFERENCES estabelecimentos(id),
    data TEXT NOT NULL,
    paradas TEXT NOT NULL,
    distancia_total_km REAL NOT NULL,
    minutos_estimados INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'planned',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS agente_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_agente TEXT NOT NULL,
    entrada TEXT NOT NULL,
    saida TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
]
