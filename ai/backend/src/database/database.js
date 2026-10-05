import fs from 'node:fs/promises'
import path from 'node:path'
import sqlite3 from 'sqlite3'
import { databasePath } from '../config/database-config.js'
import { marketplaceTables } from './schema.js'

const sqlite = sqlite3.verbose()

export class DatabaseConnection {
  constructor(filePath = databasePath) {
    this.filePath = filePath
    this.database = null
  }

  async initialize() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true })
    this.database = new sqlite.Database(this.filePath)

    await this.run('PRAGMA foreign_keys = ON')
    await this.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        endereco TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 1,
        horario_entrega TEXT NOT NULL DEFAULT '05:30-06:00',
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const columns = await this.all('PRAGMA table_info(clientes)')
    const columnNames = new Set(columns.map((column) => column.name))

    if (!columnNames.has('quantidade')) {
      await this.run("ALTER TABLE clientes ADD COLUMN quantidade INTEGER NOT NULL DEFAULT 1")
    }

    if (!columnNames.has('horario_entrega')) {
      await this.run("ALTER TABLE clientes ADD COLUMN horario_entrega TEXT NOT NULL DEFAULT '05:30-06:00'")
    }

    for (const createTable of marketplaceTables) {
      await this.run(createTable)
    }

    return this
  }

  run(sql, parameters = []) {
    if (!this.database) {
      throw new Error('Banco de dados nao inicializado.')
    }

    return new Promise((resolve, reject) => {
      this.database.run(sql, parameters, function onRun(error) {
        if (error) {
          reject(error)
          return
        }

        resolve({ id: this.lastID, changes: this.changes })
      })
    })
  }

  get(sql, parameters = []) {
    if (!this.database) {
      throw new Error('Banco de dados nao inicializado.')
    }

    return new Promise((resolve, reject) => {
      this.database.get(sql, parameters, (error, row) => {
        if (error) {
          reject(error)
          return
        }

        resolve(row)
      })
    })
  }

  all(sql, parameters = []) {
    if (!this.database) {
      throw new Error('Banco de dados nao inicializado.')
    }

    return new Promise((resolve, reject) => {
      this.database.all(sql, parameters, (error, rows) => {
        if (error) {
          reject(error)
          return
        }

        resolve(rows)
      })
    })
  }

  close() {
    if (!this.database) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.database.close((error) => {
        if (error) {
          reject(error)
          return
        }

        this.database = null
        resolve()
      })
    })
  }
}

let databaseConnection

export function createDatabaseConnection(filePath = databasePath) {
  return new DatabaseConnection(filePath)
}

export async function initializeDatabase() {
  if (!databaseConnection) {
    databaseConnection = createDatabaseConnection()
  }

  await databaseConnection.initialize()
  return databaseConnection
}

export function getDatabaseConnection() {
  if (!databaseConnection) {
    databaseConnection = createDatabaseConnection()
  }

  return databaseConnection
}

async function getReadyConnection() {
  const connection = getDatabaseConnection()

  if (!connection.database) {
    await connection.initialize()
  }

  return connection
}

// Atalhos sobre a conexao padrao para os repositorios que nao recebem a conexao por parametro.
export async function run(sql, parameters) {
  return (await getReadyConnection()).run(sql, parameters)
}

export async function get(sql, parameters) {
  return (await getReadyConnection()).get(sql, parameters)
}

export async function all(sql, parameters) {
  return (await getReadyConnection()).all(sql, parameters)
}
