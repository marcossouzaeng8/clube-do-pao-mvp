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