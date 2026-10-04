# Tech Stack (MVP Pão Quente)

Este documento define as tecnologias e bibliotecas homologadas para o desenvolvimento do MVP.

## 1. Frontend (Mobile-First Web App)
- **Framework:** React (v18+)
- **Bundler:** Vite (Escolhido pelo tempo de inicialização rápido no desenvolvimento local)
- **Estilização:** Tailwind CSS (Permite prototipação rápida de interfaces móveis sem arquivos CSS externos)
- **Ícones:** Lucide React (Biblioteca leve e escalável)
- **Roteamento:** React Router (Para navegação entre a tela da Padaria e a tela do Cliente)

## 2. Backend (API REST)
- **Runtime:** Node.js (v20 LTS)
- **Framework:** Express.js (Minimalista, ideal para expor os webhooks e endpoints do MVP)
- **Middlewares:** 
  - `cors`: Para permitir comunicação entre o frontend e backend rodando em portas distintas no localhost.
  - `express.json`: Para parseamento dos payloads (ex: disparo da nova fornada).

## 3. Persistência de Dados (Infraestrutura Local)
- **Banco de Dados:** SQLite3 
  - **Motivação:** Para a demonstração do MVP, o SQLite opera através de um arquivo local `.db`. Isso elimina a necessidade de subir contêineres pesados ou depender de conexões com a nuvem, garantindo que o sistema de assinaturas funcione de forma isolada e offline durante a apresentação.