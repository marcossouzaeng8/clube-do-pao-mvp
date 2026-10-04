# Standards & Conventions

Regras de codificação e estilo para garantir a padronização e manutenção do projeto.

## 1. Estrutura do Repositório
O projeto seguirá uma estrutura de monorepo simplificado:
/projeto-padaria
  ├── /frontend   # Código React
  ├── /backend    # Código Node.js
  └── README.md   # Instruções de setup

## 2. Padronização de Código (Linting)
- **Ferramentas:** Prettier e ESLint deverão estar configurados no VS Code para formatação automática ao salvar.
- **Frontend:** Uso exclusivo de Componentes Funcionais (Functional Components) e React Hooks. Proibido o uso de Class Components.
- **Backend:** Uso estrito de `async/await` no controle de fluxo. É proibido o encadeamento profundo de `.then()` (Callback Hell).

## 3. Nomenclatura e Tipagem
- **Variáveis e Funções:** `camelCase` (ex: `registrarAssinatura`, `notificarClientes`).
- **Componentes React:** `PascalCase` (ex: `PainelPadaria.jsx`, `BotaoFornada.jsx`).
- **Nomes de Arquivos (Backend):** `kebab-case` (ex: `customer-routes.js`, `database-config.js`).

## 4. Controle de Versão (Git)
Utilização do padrão **Conventional Commits** para facilitar a leitura do histórico de evolução do MVP:
- `feat: [descrição]` para novas funcionalidades (ex: *feat: adiciona botão de nova fornada*)
- `fix: [descrição]` para correção de bugs
- `chore: [descrição]` para atualizações de dependências e configurações