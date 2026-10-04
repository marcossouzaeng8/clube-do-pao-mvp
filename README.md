# Clube do Pao

MVP local de assinaturas de Kit Pao Quente e operacao de entregas.

## Estrutura

- `frontend`: SPA React com Vite, Tailwind CSS, React Router e Lucide React.
- `backend`: API Node.js com Express, CORS e persistencia SQLite.
- `backend/data`: arquivo local do banco SQLite (nao versionado).

## Inicializacao

Requisito: Node.js 20 LTS ou superior.

```bash
npm install
copy backend\\.env.example backend\\.env
npm run dev
```

O frontend sera servido em `http://localhost:5173` e a API em `http://localhost:3000`.
O proxy do Vite encaminha `/api` para o backend. O endpoint inicial de verificacao e `GET /api/health`.

## Proximo plano de implementacao

1. Criar o schema SQLite para clientes e status operacional do dia.
2. Implementar cadastro com nome, endereco, WhatsApp e ativacao imediata.
3. Implementar demanda consolidada pela contagem de clientes `ACTIVE`.
4. Implementar o gatilho de rota em lote e o log de notificacoes simuladas.
5. Conectar as telas de cliente e padaria aos endpoints da API.
