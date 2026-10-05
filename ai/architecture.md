# Architecture Decision Records (ADRs)

Decisões de alto nível sobre a estrutura da solução de assinaturas e notificações.

## ADR 001: Separação Cliente-Servidor
- **Contexto:** Precisamos de uma interface para clientes (assinatura) e padeiros (painel de controle), além de um motor de regras.
- **Decisão:** A aplicação será dividida em um repositório (ou pastas raiz) isolando o Frontend (SPA em React) do Backend (API em Node.js).
- **Consequência:** Garante o desacoplamento. No futuro, o frontend web pode ser substituído por um aplicativo nativo em Flutter ou Kotlin sem necessidade de reescrever a lógica de notificação do backend.

## ADR 002: Estratégia de Hospedagem para Demonstração
- **Contexto:** O projeto é um MVP acadêmico que será demonstrado ao vivo. Depender de deploys gratuitos (como render.com ou Heroku) pode gerar lentidão ("cold starts") no momento da apresentação.
- **Decisão:** O ambiente de demonstração será 100% local. O backend Node.js rodará na porta `3000` e o frontend Vite na porta `5173`. A demonstração mobile será feita acessando o IP local da máquina na mesma rede Wi-Fi.
- **Consequência:** Alta confiabilidade, latência zero e garantia de funcionamento no momento da avaliação.

## ADR 003: Disparo de Notificações Simulado
- **Contexto:** A notificação de "Fornada Saindo" é a principal entrega de valor, mas integrações reais com WhatsApp ou SMS geram custos ou bloqueios de API.
- **Decisão:** O backend registrará as notificações em um log de terminal estilizado no servidor e exibirá um "Toast" (alerta visual) simulado no frontend dos clientes conectados.

## ADR 004: Autenticação por Token JWT
- **Contexto:** A Release 3 introduz papéis (consumidor, administrador e operador) e ações restritas, como reservar ou agendar fornadas.
- **Decisão:** Senhas são gravadas com hash `bcrypt` e o login emite um JWT assinado com `JWT_SECRET`. Middlewares do Express (`requireAuth`, `requireRole`) protegem as rotas. O frontend guarda a sessão no `localStorage`.
- **Consequência:** A API continua sem estado e o mesmo token servirá a um futuro aplicativo nativo. As rotas do MVP base (`/api/clientes`, `/api/pcp`) seguem abertas para não quebrar a demonstração existente.

## ADR 005: Agentes de IA Determinísticos
- **Contexto:** Os agentes (demanda, matchmaking, rotas e retenção) são o diferencial do produto, mas chamadas a um LLM trazem custo, latência e dependência de internet na apresentação.
- **Decisão:** Cada agente é um módulo em `backend/src/services/agents` com regras determinísticas (médias, pontuação ponderada e vizinho mais próximo), e toda execução é registrada em `agente_logs`.
- **Consequência:** Resultado previsível e offline. A lógica pode ser trocada por um LLM no futuro mantendo a mesma entrada e saída de cada módulo.

## ADR 006: Pagamento Simulado
- **Contexto:** Reservas e assinaturas exigem pagamento, mas integrar um gateway real foge do escopo do MVP acadêmico.
- **Decisão:** `payment-service.js` simula o gateway, com taxa de aprovação configurável por `PAYMENT_APPROVAL_RATE`. Nenhum dado de cartão é coletado.
- **Consequência:** O fluxo completo (aprovado, recusado e estornado) é demonstrável. Trocar pelo gateway real exige alterar apenas esse serviço.

## ADR 007: Mapa com Leaflet e OpenStreetMap
- **Contexto:** O mapa de padarias precisa funcionar sem chave de API paga.
- **Decisão:** Uso de `react-leaflet` com os tiles públicos do OpenStreetMap.
- **Consequência:** Custo zero. É o único ponto que precisa de internet: sem conexão, o mapa fica sem imagem de fundo, mas a lista de padarias e as demais telas continuam funcionando.
