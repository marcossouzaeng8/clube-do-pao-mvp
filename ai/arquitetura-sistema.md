# Arquitetura do Sistema — Clube do Pão

Documento de arquitetura do MVP (entregável da prática "Criando a arquitetura de um sistema"). As decisões pontuais estão registradas como ADRs em [`architecture.md`](architecture.md); as regras de negócio, em [`business-rules.md`](business-rules.md).

## 1. Visão Geral

O **Clube do Pão** digitaliza a operação de padarias de bairro em duas frentes:

- **Assinatura do Kit Pão Quente:** o cliente escolhe quantidade e faixa de horário; a padaria enxerga a demanda do dia e a rota de entrega.
- **Marketplace de fornadas:** o consumidor vê no mapa onde o pão está saindo do forno, reserva pagando na hora ou assina um plano; a padaria agenda fornadas e é apoiada por agentes de IA.

### Problema

- Toda vez que o cliente chega à padaria, o pão já não está quente.
- O cliente não tem tempo de ir à padaria todo dia.
- A padaria produz no escuro: sem previsão de demanda, sobra ou falta pão.

### Solução

Cronograma de fornadas em tempo real, mapa de padarias próximas, reservas com pagamento antecipado, assinaturas recorrentes e agentes que apoiam produção, matchmaking, rotas e retenção.

---

## 2. Funcionalidades Principais

| # | Funcionalidade | Onde |
|---|----------------|------|
| 1 | Assinatura simples do Kit Pão Quente (quantidade e faixa de horário) | `/cliente` |
| 2 | Painel da padaria: demanda do dia, rota por horário e despacho com notificação simulada | `/padaria` |
| 3 | Contas com três papéis e login | `/cadastro`, `/login` |
| 4 | Cadastro de padarias e produtos | `/operacao` |
| 5 | Cronograma de fornadas com status em tempo real | `/fornadas`, `/operacao` |
| 6 | Mapa de padarias próximas | `/mapa` |
| 7 | Reserva com pagamento antecipado (simulado) | `/fornadas`, `/reservas` |
| 8 | Assinaturas por plano com cashback | `/assinaturas` |
| 9 | Quatro agentes de IA: demanda, matchmaking, rotas e retenção | `/mapa`, `/operacao` |

---

## 3. Diagrama de Arquitetura (Camadas)

### 3.1 Visão em camadas — Frontend → API → Banco

```mermaid
flowchart TB
    subgraph FRONT["Frontend — React 18 + Vite + Tailwind CSS (porta 5173)"]
        PAGES["Páginas<br/>Home · Cliente · Padaria · Mapa · Fornadas<br/>Reservas · Assinaturas · Operação · Login"]
        HOOKS["Custom hooks<br/>estado e chamadas HTTP"]
        CLIENT["lib/api.js<br/>cliente REST com token"]
        PAGES --> HOOKS --> CLIENT
    end

    subgraph API["API — Node.js + Express (porta 3000)"]
        ROUTES["Routes + middlewares de autenticação"]
        CONTROLLERS["Controllers<br/>validação e resposta HTTP"]
        SERVICES["Services<br/>auth · pagamento simulado · agentes"]
        REPOS["Repositories<br/>SQL"]
        ROUTES --> CONTROLLERS --> SERVICES --> REPOS
        CONTROLLERS --> REPOS
    end

    subgraph DB["Banco de dados — SQLite (arquivo local)"]
        TABLES["clientes · usuarios · estabelecimentos · produtos · fornadas<br/>reservas · assinaturas · pagamentos · rotas_entrega · agente_logs"]
    end

    CLIENT -->|"REST/JSON via proxy /api"| ROUTES
    REPOS -->|"sqlite3"| TABLES
```

### 3.2 Componentes por tipo de usuário

```mermaid
graph LR
    subgraph Usuários
        V[Visitante]
        C[Consumidor]
        O[Operador]
        A[Admin da padaria]
    end

    subgraph Frontend
        P0["/cliente"]
        P1["/mapa"]
        P2["/fornadas"]
        P3["/reservas"]
        P4["/assinaturas"]
        P5["/padaria"]
        P6["/operacao"]
    end

    subgraph Backend
        R1[Routes + Auth]
        R2[Controllers]
        R3[Agentes]
        R4[Repositories]
    end

    BD[(SQLite)]

    V --> P0 & P1 & P2 & P5
    C --> P1 & P2 & P3 & P4
    O --> P6
    A --> P6
    P0 & P1 & P2 & P3 & P4 & P5 & P6 --> R1
    R1 --> R2
    R2 --> R3
    R2 --> R4
    R3 --> R4
    R4 --> BD
```

### 3.3 Organização do código

```
ai/
├── standards.md, architecture.md, tech-stack.md, business-rules.md   # arquivos de contexto
├── prd.md, arquitetura-sistema.md                                    # produto e arquitetura
├── backend/src/
│   ├── routes/          # rotas Express
│   ├── middlewares/     # requireAuth, requireRole
│   ├── controllers/     # validação de entrada e resposta
│   ├── services/        # auth, pagamento simulado e agents/
│   ├── repositories/    # consultas SQL
│   ├── database/        # conexão, schema e seed
│   └── __tests__/       # testes de API (node --test)
└── frontend/src/
    ├── pages/           # telas
    ├── hooks/           # estado e chamadas HTTP por tela
    ├── components/      # PageShell, ScheduleCard, MapView...
    └── lib/             # cliente da API, sessão e formatação
```

---

## 4. Tipos de Usuários e Permissões

| Papel | O que faz |
|-------|-----------|
| **Visitante** (sem login) | Assina o Kit Pão Quente em `/cliente`; vê mapa e cronograma; acessa o painel `/padaria` do MVP base |
| **Consumidor** (`CONSUMER`) | Reserva fornadas, assina planos, usa o matchmaking |
| **Operador** (`ESTABLISHMENT_OPERATOR`) | Agenda fornadas, atualiza status, executa os agentes da operação |
| **Admin** (`ESTABLISHMENT_ADMIN`) | Tudo do operador e cadastro de padarias e produtos |

### 4.1 Matriz de permissões

| Ação | Visitante | Consumidor | Operador | Admin |
|------|:---------:|:----------:|:--------:|:-----:|
| Assinatura simples e painel `/padaria` | ✅ | ✅ | ✅ | ✅ |
| Ver mapa e cronograma | ✅ | ✅ | ✅ | ✅ |
| Matchmaking (buscar pão quente) | ❌ | ✅ | ✅ | ✅ |
| Reservar e assinar plano | ❌ | ✅ | ❌ | ❌ |
| Agendar fornada e mudar status | ❌ | ❌ | ✅ | ✅ |
| Agentes de demanda, rotas e retenção | ❌ | ❌ | ✅ | ✅ |
| Cadastrar padaria | ❌ | ❌ | ❌ | ✅ |

### 4.2 Fluxo de autorização

```mermaid
flowchart TD
    A[Requisição a rota protegida] --> B{Header Authorization<br/>com token JWT?}
    B -->|Não| C[401 Não autorizado]
    B -->|Sim| D{Token válido?}
    D -->|Não| C
    D -->|Sim| E{Papel permitido<br/>para a rota?}
    E -->|Não| F[403 Permissão negada]
    E -->|Sim| G[Controller executa a operação]
```

---

## 5. Entidades Principais e Relacionamentos

```mermaid
erDiagram
    usuarios ||--o{ estabelecimentos : "administra"
    usuarios ||--o{ reservas : "faz"
    usuarios ||--o{ assinaturas : "assina"

    estabelecimentos ||--o{ produtos : "oferece"
    estabelecimentos ||--o{ fornadas : "programa"
    estabelecimentos ||--o{ assinaturas : "recebe"
    estabelecimentos ||--o{ rotas_entrega : "planeja"

    produtos ||--o{ fornadas : "assado em"
    fornadas ||--o{ reservas : "reservada em"

    pagamentos ||--o| reservas : "paga"
    assinaturas ||--o{ pagamentos : "cobrança"

    clientes {
        int id PK
        string nome
        string endereco
        string whatsapp
        int quantidade
        string horario_entrega
        string status
    }

    usuarios {
        int id PK
        string email UK
        string senha_hash
        string nome
        string papel
        string endereco
        float lat
        float lng
    }

    estabelecimentos {
        int id PK
        string nome
        string endereco
        float lat
        float lng
        string telefone
        int admin_usuario_id FK
    }

    produtos {
        int id PK
        int estabelecimento_id FK
        string nome
        float preco
        string categoria
    }

    fornadas {
        int id PK
        int estabelecimento_id FK
        int produto_id FK
        datetime horario_previsto
        datetime pronto_em
        int quantidade
        int disponivel
        string status
    }

    reservas {
        int id PK
        int usuario_id FK
        int fornada_id FK
        int quantidade
        float valor_total
        string status
        int pagamento_id FK
    }

    assinaturas {
        int id PK
        int usuario_id FK
        int estabelecimento_id FK
        string plano
        float preco
        string status
        float saldo_cashback
    }

    pagamentos {
        int id PK
        float valor
        string metodo
        string status
        string tipo
        string id_externo
        int assinatura_id FK
    }

    rotas_entrega {
        int id PK
        int estabelecimento_id FK
        date data
        json paradas
        float distancia_total_km
        int minutos_estimados
    }

    agente_logs {
        int id PK
        string tipo_agente
        json entrada
        json saida
    }
```

`clientes` é a assinatura simples do MVP base: não tem login e não se relaciona com as demais tabelas. `agente_logs` guarda a entrada e a saída de cada execução de agente.

---

## 6. Endpoints da API

Rotas marcadas com 🔒 exigem `Authorization: Bearer <token>`.

| Método | Rota | Papel | Descrição |
|--------|------|-------|-----------|
| GET | `/api/health` | — | Verificação do serviço |
| POST | `/api/clientes` | — | Assinatura simples (nome, endereço, WhatsApp, quantidade, faixa de horário) |
| DELETE | `/api/clientes` | — | Limpa a base de clientes (demonstração) |
| GET | `/api/pcp/demanda` | — | Total de clientes ativos e de pães a produzir |
| GET | `/api/pcp/rota` | — | Entregas ordenadas por faixa de horário |
| POST | `/api/pcp/despacho` | — | Inicia a rota e simula as notificações |
| POST | `/api/auth/cadastro` | — | Cria a conta e devolve o token |
| POST | `/api/auth/login` | — | Autentica e devolve o token |
| GET | `/api/estabelecimentos` | — | Lista padarias; filtro por `lat`, `lng` e `raio` |
| POST | `/api/estabelecimentos` | 🔒 Admin | Cadastra padaria e produtos |
| GET | `/api/fornadas` | — | Cronograma; filtro por `estabelecimento_id` e `status` |
| POST | `/api/fornadas` | 🔒 Admin, Operador | Agenda fornada |
| PATCH | `/api/fornadas/:id` | 🔒 Admin, Operador | Atualiza o status da fornada |
| GET | `/api/reservas` | 🔒 | Reservas do usuário |
| POST | `/api/reservas` | 🔒 Consumidor | Cria reserva com pagamento |
| GET | `/api/assinaturas` | 🔒 | Assinaturas do usuário |
| POST | `/api/assinaturas` | 🔒 Consumidor | Assina um plano |
| POST | `/api/agentes/matchmaking` | 🔒 | Melhor pão quente no raio |
| POST | `/api/agentes/previsao-demanda` | 🔒 Admin, Operador | Sugestão de produção por produto |
| POST | `/api/agentes/rotas` | 🔒 Admin, Operador | Rota otimizada do dia |
| POST | `/api/agentes/retencao` | 🔒 Admin, Operador | Notificações de upsell |

---

## 7. Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Lucide React |
| Mapa | Leaflet + React Leaflet, tiles do OpenStreetMap |
| Backend | Node.js 20, Express, CORS |
| Autenticação | JWT (`jsonwebtoken`) e hash de senha (`bcryptjs`) |
| Banco de dados | SQLite (`sqlite3`), arquivo local |
| Agentes | Módulos JavaScript determinísticos, prontos para troca por LLM |
| Testes | `node --test` na API; Vitest + Testing Library no frontend |
| Execução | 100% local: Vite na porta 5173 e API na porta 3000 |

Versões e bibliotecas homologadas estão em [`tech-stack.md`](tech-stack.md).

---

## 8. Fluxos Principais

### 8.1 Visão geral

```mermaid
flowchart LR
    U[Usuário] --> T{Perfil}
    T -->|Visitante| K[Assina o Kit Pão Quente]
    T -->|Consumidor| M[Mapa e cronograma]
    T -->|Operador ou Admin| O[Operação da padaria]
    K --> PCP[Painel: demanda e rota do dia]
    M --> R[Reserva ou assinatura]
    R --> P[Pagamento simulado]
    P --> Q{Aprovado?}
    Q -->|Sim| OK[Confirmação]
    Q -->|Não| NO[Cancelamento]
    O --> F[Agenda e atualiza fornadas]
    F --> AG[Agentes de IA]
    AG --> S[Sugestões, rota e convites]
```

### 8.2 Assinatura simples e despacho (MVP base)

```mermaid
sequenceDiagram
    actor C as Cliente
    actor P as Padeiro
    participant F as Frontend
    participant A as API
    participant D as SQLite

    C->>F: Nome, endereço, WhatsApp, quantidade e horário
    F->>A: POST /api/clientes
    A->>D: Grava cliente com status ACTIVE
    A-->>F: 201 Assinatura ativa
    P->>F: Abre o painel da padaria
    F->>A: GET /api/pcp/demanda e /api/pcp/rota
    A->>D: Soma quantidades e ordena por horário
    A-->>F: Pães a produzir e rota do dia
    P->>F: Iniciar rota de entrega
    F->>A: POST /api/pcp/despacho
    A-->>F: Notificações simuladas enviadas
```

### 8.3 Ciclo de vida da fornada

```mermaid
stateDiagram-v2
    [*] --> SCHEDULED: Admin ou operador agenda
    SCHEDULED --> BAKING: Inicia a fornada
    BAKING --> READY: Pão saiu do forno
    SCHEDULED --> SOLD_OUT: Reservas esgotam as unidades
    BAKING --> SOLD_OUT: Reservas esgotam as unidades
    READY --> SOLD_OUT: Reservas esgotam as unidades
    SOLD_OUT --> [*]
```

### 8.4 Reserva com pagamento

```mermaid
sequenceDiagram
    actor C as Consumidor
    participant F as Frontend
    participant A as API
    participant P as Pagamento simulado
    participant D as SQLite

    C->>F: Escolhe fornada e quantidade
    F->>A: POST /api/reservas
    A->>D: Busca a fornada
    alt Sem unidades suficientes
        A-->>F: 400 Quantidade indisponível
    else Há unidades
        A->>P: Processa pagamento
        alt Pagamento recusado
            P-->>A: FAILED
            A->>D: Pagamento FAILED e reserva CANCELLED
            A-->>F: 402 Pagamento recusado
        else Pagamento aprovado
            P-->>A: APPROVED
            A->>D: Baixa atômica: desconta se ainda houver unidades
            alt Baixa efetuada
                A->>D: Reserva CONFIRMED
                A-->>F: 201 Reserva confirmada
            else Outra reserva levou as últimas unidades
                A->>D: Pagamento REFUNDED e reserva CANCELLED
                A-->>F: 409 Fornada esgotou
            end
        end
    end
    F-->>C: Mostra o resultado
```

### 8.5 Assinatura por plano com cashback

```mermaid
sequenceDiagram
    actor C as Consumidor
    participant F as Frontend
    participant A as API
    participant P as Pagamento simulado
    participant D as SQLite

    C->>F: Escolhe padaria e plano (diário, semanal ou mensal)
    F->>A: POST /api/assinaturas
    A->>P: Processa o valor do plano
    alt Aprovado
        P-->>A: APPROVED
        A->>D: Assinatura ACTIVE com 5% de cashback
        A-->>F: 201 Assinatura ativa
    else Recusado
        P-->>A: FAILED
        A->>D: Assinatura CANCELLED
        A-->>F: 402 Pagamento recusado
    end
```

### 8.6 Mapa e matchmaking

```mermaid
flowchart TD
    A[Consumidor abre o mapa] --> B{Localização disponível?}
    B -->|Sim| C[Usa a posição do consumidor]
    B -->|Não ou sem padarias no raio| D[Usa a região de demonstração]
    C --> E["GET /api/estabelecimentos?lat&lng&raio"]
    D --> E
    E --> F[Padarias no mapa com distância e próximas fornadas]
    F --> G{Clica em Encontrar pão quente?}
    G -->|Sim| H[POST /api/agentes/matchmaking]
    H --> I[Agente pontua as fornadas do raio]
    I --> J[Mostra o melhor match e leva à reserva]
    G -->|Não| K[Navega pelo mapa e pelo cronograma]
```

---

## 9. Agentes de IA

Os quatro agentes são módulos determinísticos em `backend/src/services/agents` (ADR 005). Cada execução é gravada em `agente_logs`.

```mermaid
flowchart TB
    subgraph Entradas
        E1[Assinaturas ativas]
        E2[Histórico de reservas]
        E3[Localização do consumidor]
        E4[Fornadas do dia]
        E5[Endereços de entrega]
    end

    subgraph Agentes
        A1[Previsão de demanda]
        A2[Matchmaking]
        A3[Otimização de rotas]
        A4[Retenção e upsell]
    end

    subgraph Saídas
        S1[Quantidade e horário sugeridos]
        S2[Melhor padaria e score]
        S3[Rota ordenada, distância e tempo]
        S4[Convite personalizado]
    end

    E1 & E2 --> A1 --> S1
    E3 & E4 --> A2 --> S2
    E1 & E2 & E5 --> A3 --> S3
    E2 & E4 --> A4 --> S4

    A1 & A2 & A3 & A4 --> LOG[(agente_logs)]
```

| Agente | Entrada | Regra | Saída |
|--------|---------|-------|-------|
| **Previsão de demanda** | Assinaturas ativas e reservas dos últimos 30 dias | (média por produto, ou 5 sem histórico, + 2 pães por assinatura divididos entre os produtos) × peso do dia da semana | Quantidade, horário e confiança por produto |
| **Matchmaking** | Localização, raio e produto opcional | Score = 50% status (`READY` 100, `BAKING` 80, `SCHEDULED` 40) + 30% proximidade + 20% disponibilidade | Lista ordenada e melhor match |
| **Otimização de rotas** | Assinantes ativos e reservas confirmadas do dia | Uma parada por consumidor; vizinho mais próximo a partir da padaria; 3 min por km + 5 min por parada | Paradas em ordem, distância e tempo |
| **Retenção e upsell** | Fornadas prontas e reservas dos últimos 60 dias | Quem pediu o produto ao menos 2 vezes no mesmo dia da semana recebe um convite | Mensagens personalizadas |

---

## 10. Decisões Arquiteturais

Resumo dos ADRs de [`architecture.md`](architecture.md):

1. **Cliente e servidor separados (ADR 001):** SPA React e API Node.js independentes; o frontend pode virar aplicativo nativo sem reescrever o backend.
2. **Demonstração 100% local (ADR 002):** sem dependência de deploy em nuvem na apresentação.
3. **Notificações simuladas (ADR 003):** log no servidor e aviso visual no lugar de WhatsApp ou SMS reais.
4. **Autenticação por JWT (ADR 004):** API sem estado, com papéis verificados em middleware.
5. **Agentes determinísticos (ADR 005):** resultado previsível e offline, com a mesma entrada e saída que um LLM usaria no futuro.
6. **Pagamento simulado (ADR 006):** fluxo completo de aprovado, recusado e estornado sem gateway real.
7. **Mapa com Leaflet e OpenStreetMap (ADR 007):** sem chave de API; é o único ponto que precisa de internet.

---

## 11. Limitações Conhecidas e Próximos Passos

- A assinatura simples (`clientes`) e a assinatura por plano (`assinaturas`) ainda são fluxos separados.
- Admin e operador não estão vinculados a uma padaria específica: qualquer um deles opera qualquer padaria.
- O cadastro permite escolher o papel livremente; em produção, o papel de admin exigiria aprovação.
- Próximos passos: gateway de pagamento real, notificações reais (WhatsApp ou push), LLM nos agentes de retenção e matchmaking e aplicativo móvel.
