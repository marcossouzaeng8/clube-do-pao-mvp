# Clube do Pao

MVP local de assinaturas de Kit Pao Quente, operacao de entregas e marketplace de fornadas com agentes de IA.

## Estrutura

- `frontend`: SPA React com Vite, Tailwind CSS, React Router, Lucide React e Leaflet.
- `backend`: API Node.js com Express, CORS, JWT e persistencia SQLite.
- `backend/data`: arquivo local do banco SQLite (nao versionado).
- `arquitetura-sistema.md`: documento de arquitetura (camadas, entidades, endpoints e fluxos, com diagramas Mermaid).
- `standards.md`, `architecture.md`, `tech-stack.md` e `business-rules.md`: arquivos de contexto para os agentes de IA.
- `prd.md`: requisitos do produto.

## Inicializacao

Requisito: Node.js 20 LTS ou superior.

```bash
npm install
copy backend\\.env.example backend\\.env
npm run seed
npm run dev
```

No macOS ou Linux, use `cp backend/.env.example backend/.env`.

O frontend sera servido em `http://localhost:5173` e a API em `http://localhost:3000`.
O proxy do Vite encaminha `/api` para o backend. O endpoint inicial de verificacao e `GET /api/health`.

## Testes

```bash
npm test
npm run lint
```

`npm test` roda os testes da API (`node --test`) e do frontend (Vitest).

## Dados de demonstracao

`npm run seed` recria padarias, produtos, fornadas, reservas e contas de exemplo (a tabela `clientes` do MVP base nao e apagada). Rode de novo antes de cada demonstracao: as fornadas sao criadas em relacao ao horario atual.

| Papel | Email | Senha |
| :--- | :--- | :--- |
| Consumidor | maria@email.com | 123456 |
| Admin da padaria | joao@padaria.com | 123456 |
| Operador | operador@padaria.com | 123456 |

## Telas

| Rota | Publico | O que faz |
| :--- | :--- | :--- |
| `/cliente` | Cliente | Assinatura simples do Kit Pao Quente (quantidade e faixa de horario) |
| `/padaria` | Padaria | Demanda do dia, rota ordenada por horario e despacho |
| `/mapa` | Todos | Padarias proximas e matchmaking de pao quente |
| `/fornadas` | Todos | Cronograma de fornadas e reserva com pagamento |
| `/reservas`, `/assinaturas` | Consumidor | Reservas feitas, planos e cashback |
| `/operacao` | Admin e operador | Agendar fornadas, mudar status e executar os agentes de IA |

## API

Rotas marcadas com 🔒 exigem `Authorization: Bearer <token>`.

| Rota | Descricao |
| :--- | :--- |
| `POST /api/clientes`, `DELETE /api/clientes` | Assinatura simples do MVP base |
| `GET /api/pcp/demanda`, `GET /api/pcp/rota`, `POST /api/pcp/despacho` | PCP e despacho do MVP base |
| `POST /api/auth/cadastro`, `POST /api/auth/login` | Contas e sessao |
| `GET /api/estabelecimentos`, 🔒 `POST /api/estabelecimentos` | Padarias (filtro por `lat`, `lng` e `raio`) |
| `GET /api/fornadas`, 🔒 `POST /api/fornadas`, 🔒 `PATCH /api/fornadas/:id` | Cronograma de fornadas |
| 🔒 `GET /api/reservas`, 🔒 `POST /api/reservas` | Reservas com pagamento simulado |
| 🔒 `GET /api/assinaturas`, 🔒 `POST /api/assinaturas` | Assinaturas por plano com cashback |
| 🔒 `POST /api/agentes/matchmaking` | Melhor pao quente no raio do consumidor |
| 🔒 `POST /api/agentes/previsao-demanda`, `/rotas`, `/retencao` | Agentes da operacao |
