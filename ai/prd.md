# Product Requirements Document (PRD)

**Projeto:** Clube do Pão (Assinatura e Delivery de Pães Frescos)
**Status:** Atualizado (Release 1, Release 2 & Release 3)

## 1. Visão Executiva e Estratégia
O "Clube do Pão" transforma um produto de consumo diário e baixo ticket médio em um motor de receita recorrente. A solução digitaliza a operação de padarias de bairro, substituindo a dependência do tráfego orgânico por previsibilidade de demanda. 

Ao consolidar uma base de assinantes, a padaria otimiza o Planejamento e Controle da Produção (PCP), reduzindo desperdícios na fornada e estruturando uma operação de *fulfillment* (atendimento) e *last-mile* (última milha) altamente eficiente. O foco deste MVP é provar a viabilidade da inteligência comercial e logística em ambiente local antes de escalar a infraestrutura.

## 2. Escopo do Produto e Fases de Lançamento

### Release 1: MVP Base (Validação de Fluxo)
O objetivo da R1 foi validar a viabilidade técnica de ponta a ponta (Cliente -> Backend -> Padaria).
- **Escopo:** Cadastro simples (Nome, Endereço e WhatsApp), ativação automática da assinatura com plano único, dashboard com total de clientes ativos, e simulação de notificação de despacho em lote no terminal.

### Release 2: Evolução Logística (Foco Atual)
O objetivo da R2 é adicionar controle de ticket médio e inteligência de roteirização para o last-mile.
- **Escopo:** Inclusão de seleção de "Quantidade de Pães" e "Faixas de Horário" no cadastro. Atualização do dashboard da padaria para exibir o volume total de pães da fornada e uma lista de roteirização ordenada cronologicamente para a entrega.

### Release 3: Marketplace de Fornadas e Agentes de IA
O objetivo da R3 é atender também o consumidor avulso ("o pão nunca está quente quando chego na padaria") e apoiar a operação com agentes de IA. Integra o protótipo "Pãozinho Quente" à base do Clube do Pão.
- **Escopo:** Contas com três papéis (consumidor, administrador e operador da padaria), cadastro de padarias e produtos, cronograma de fornadas em tempo real, mapa de padarias próximas, reserva com pagamento antecipado, assinaturas por plano com cashback e quatro agentes (previsão de demanda, matchmaking, otimização de rotas e retenção/upsell).
- **Fora do escopo:** Gateway de pagamento real (o pagamento é simulado) e unificação da assinatura simples da R1/R2 (tabela `clientes`) com as assinaturas por conta da R3.

## 3. Jornadas do Usuário

### 3.1. Visão do Cliente (B2C)
1. **Adesão e Personalização:** Acessa o Web App, preenche os dados de contato (Nome, WhatsApp, Endereço), define quantos pães deseja receber diariamente e escolhe a faixa de horário de entrega desejada.
2. **Confirmação:** Recebe o feedback visual (card de sucesso) informando que a assinatura está ativa.
3. **Notificação Diária:** É alertado de que a entrega foi despachada.

### 3.2. Visão da Padaria (B2B - Operação/Fulfillment)
1. **Previsibilidade (PCP):** Acessa o painel e visualiza instantaneamente o total de clientes ativos e a soma total de pães que precisam ser assados.
2. **Roteirização:** Consulta a lista de entregas já ordenada automaticamente da faixa de horário mais cedo para a mais tarde, orientando a montagem dos pacotes.
3. **Despacho:** Clica em "Iniciar Rota", disparando as notificações em lote para os clientes da lista.

### 3.3. Visão do Consumidor Avulso (R3)
1. **Descoberta:** Abre o mapa, vê as padarias próximas e o status de cada fornada. Com um toque, o agente de matchmaking indica o melhor pão quente no raio.
2. **Reserva:** Escolhe a fornada e a quantidade no cronograma; o pagamento é processado antes da confirmação.
3. **Recorrência:** Assina um plano (diário, semanal ou mensal) em uma padaria e acumula cashback.

### 3.4. Visão da Operação com IA (R3)
1. **Fornadas:** O administrador ou operador agenda a fornada e avança o status (agendada → assando → pronta).
2. **Agentes:** No painel de operação, executa a previsão de demanda, a rota otimizada do dia e as notificações de upsell.

## 4. Requisitos Funcionais (User Stories)

### Release 1 (Fundação)
| ID | Épico | User Story | Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| **US-01** | Onboarding | Como cliente, quero me cadastrar para assinar o serviço de entrega. | Formulário coleta Nome, Endereço e WhatsApp, salvando no SQLite com status `ACTIVE`. |
| **US-02** | Onboarding | Como cliente, quero ver a confirmação da assinatura. | Renderiza o status "Assinatura Ativa" após o envio. |
| **US-03** | Operação | Como padeiro, quero ver o total de assinantes no dashboard. | O frontend exibe a volumetria diária de pedidos consultando o backend. |
| **US-04** | Notificação | Como sistema, devo simular o envio de um alerta quando a entrega sair. | O botão de "Iniciar Rota" itera sobre os clientes e registra os disparos no log do servidor. |

### Release 2 (Evolução Logística)
| ID | Épico | User Story | Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| **US-05** | Onboarding | Como cliente, quero escolher a quantidade de pães e a faixa de horário da entrega. | Frontend inclui input numérico e dropdown. Backend atualizado para gravar as variáveis `quantidade` e `horario_entrega`. |
| **US-06** | Operação | Como padeiro, quero ver o número total de pães a serem assados. | O card do dashboard soma a `quantidade` de todos os clientes ativos. |
| **US-07** | Roteirização | Como entregador, quero ver a ordem exata das entregas baseada no horário escolhido. | O painel consome a API que retorna os clientes ordenados do menor horário para o maior. |

### Release 3 (Marketplace de Fornadas e Agentes de IA)
| ID | Épico | User Story | Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| **US-08** | Contas | Como usuário, quero criar conta e entrar com email e senha. | Cadastro com papel `CONSUMER`, `ESTABLISHMENT_ADMIN` ou `ESTABLISHMENT_OPERATOR`; login devolve um token JWT. |
| **US-09** | Padarias | Como administrador, quero cadastrar minha padaria e seus produtos. | `POST /api/estabelecimentos` exige o papel de administrador e grava nome, endereço, coordenadas e produtos. |
| **US-10** | Fornadas | Como operador, quero agendar fornadas e atualizar o status. | A fornada evolui `SCHEDULED` → `BAKING` → `READY` → `SOLD_OUT` e aparece no cronograma público. |
| **US-11** | Descoberta | Como consumidor, quero ver no mapa as padarias próximas com pão quente. | O mapa lista as padarias no raio de 10 km com distância e próximas fornadas. |
| **US-12** | Reserva | Como consumidor, quero reservar pães de uma fornada pagando na hora. | A reserva só é confirmada com pagamento aprovado e desconta o estoque da fornada. |
| **US-13** | Assinatura | Como consumidor, quero assinar um plano e acumular cashback. | Planos diário, semanal e mensal; 5% do valor pago vira saldo de cashback. |
| **US-14** | IA | Como consumidor, quero que o sistema encontre o melhor pão quente perto de mim. | O agente de matchmaking pontua status, distância e disponibilidade e devolve o melhor match. |
| **US-15** | IA | Como padeiro, quero sugestões de produção, rota e upsell. | O painel de operação executa os agentes de demanda, rotas e retenção e registra cada execução em `agente_logs`. |

## 5. Regras de Negócio e Domínio (Business Rules)
- **Ativação Imediata:** O cadastro não depende de validação de pagamento no MVP, assumindo status `ACTIVE` instantaneamente.
- **Restrição de Horários:** O sistema aceita exclusivamente cinco faixas de entrega: 05h30 às 06h00, 06h00 às 06h30, 06h30 às 07h00, 07h00 às 07h30 e 07h30 às 08h00.
- **PCP e Rota:** A demanda de produção é estritamente a soma das quantidades solicitadas pelos usuários `ACTIVE`. A roteirização de saída deve sempre ser exibida em ordem crescente baseada nos slots de horário.

- **Reserva Paga:** Na R3, a reserva só é confirmada após o pagamento (simulado) aprovado; a baixa do estoque da fornada é atômica.
- **Permissões por Papel:** Apenas consumidores reservam e assinam; apenas administradores e operadores agendam fornadas e executam os agentes de operação.

## 6. Requisitos Não Funcionais
- **Arquitetura Visual:** Abordagem *Mobile-First* para os clientes (garantindo uso sem fricção no celular) e interface administrativa responsiva.
- **Infraestrutura Local:** O MVP roda de forma local (Node.js e React/Vite com SQLite), não dependendo de *cold starts* de servidores em nuvem, para garantir total estabilidade na demonstração em aula.

## 7. Métricas de Sucesso do Negócio (KPIs)
- **Ticket Médio:** Aumento impulsionado pela flexibilidade na escolha da quantidade de pães.
- **Taxa de Desperdício Zero:** Adequação exata da fornada baseada nos dados do painel, zerando a sobra de prateleira.
- **Densidade de Rota e SLA:** Cumprimento da entrega dentro dos slots de 30 minutos selecionados pelos clientes, medindo o custo logístico por raio de atuação.