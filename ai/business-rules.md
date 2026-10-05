# Business Rules & Domain Logic (MVP Clube do Pão - Evolução Logística)

Este documento define as regras de negócio, os domínios do sistema e a lógica de operação do MVP.

## 1. Domínio de Assinaturas (Clientes)
- **BR-1.1 (Plano com Variáveis):** A assinatura contempla a entrega diária, mas o cliente deve definir obrigatoriamente a **quantidade de pães** (número inteiro maior que zero) e escolher uma **faixa de horário** restrita.
- **BR-1.2 (Faixas de Horário Permitidas):** O sistema só aceita os seguintes slots: "05:30-06:00", "06:00-06:30", "06:30-07:00", "07:00-07:30" e "07:30-08:00".
- **BR-1.3 (Ativação):** O cadastro muda o status automaticamente para `ACTIVE`.
- **BR-1.4 (Dados Obrigatórios):** Nome, Endereço de Entrega, WhatsApp, Quantidade de Pães e Faixa de Horário.

## 2. Domínio de PCP (Planejamento e Controle da Produção)
- **BR-2.1 (Cálculo de Demanda):** O dashboard da padaria deve exibir o total de clientes ativos E a soma total da quantidade de pães solicitados para a fornada do dia.

## 3. Domínio de Fulfillment e Last-Mile (Roteirização e Despacho)
- **BR-3.1 (Ordem de Entrega):** O sistema deve gerar uma lista de roteirização para o padeiro/entregador. Essa lista deve trazer os clientes ativos ordenados obrigatoriamente da faixa de horário mais cedo (05:30) para a mais tarde (08:00).
- **BR-3.2 (Gatilho de Rota):** O botão de despacho opera em lote e simula a notificação iterando sobre a lista de clientes.

## 4. Domínio de Contas e Permissões (Release 3)
- **BR-4.1 (Papéis):** Toda conta tem um papel: `CONSUMER`, `ESTABLISHMENT_ADMIN` ou `ESTABLISHMENT_OPERATOR`. Papel ausente ou inválido no cadastro vira `CONSUMER`.
- **BR-4.2 (Sessão):** O login devolve um token JWT válido por 7 dias, enviado no header `Authorization: Bearer`.
- **BR-4.3 (Matriz de Permissões):**

| Ação | CONSUMER | OPERATOR | ADMIN |
| :--- | :---: | :---: | :---: |
| Ver mapa e cronograma (sem login) | ✅ | ✅ | ✅ |
| Usar o matchmaking | ✅ | ✅ | ✅ |
| Reservar e assinar | ✅ | ❌ | ❌ |
| Agendar fornada e mudar status | ❌ | ✅ | ✅ |
| Executar agentes de demanda, rotas e retenção | ❌ | ✅ | ✅ |
| Cadastrar padaria | ❌ | ❌ | ✅ |

## 5. Domínio de Fornadas (Release 3)
- **BR-5.1 (Ciclo de Vida):** A fornada evolui `SCHEDULED` → `BAKING` → `READY` → `SOLD_OUT`. Ao ficar `READY`, o horário real é registrado.
- **BR-5.2 (Produto da Casa):** Só é possível agendar fornada de um produto que pertence à própria padaria.
- **BR-5.3 (Janela de Exibição):** O cronograma mostra as fornadas previstas a partir de 2 horas atrás.

## 6. Domínio de Reservas e Pagamento (Release 3)
- **BR-6.1 (Pagamento Antes da Confirmação):** A reserva só fica `CONFIRMED` com pagamento aprovado. Pagamento recusado gera reserva `CANCELLED`.
- **BR-6.2 (Baixa Atômica):** A quantidade disponível da fornada é descontada em uma única operação condicional. Se as unidades acabarem durante o pagamento, a reserva é cancelada e o pagamento marcado como `REFUNDED`.
- **BR-6.3 (Esgotamento):** Ao zerar a disponibilidade, a fornada passa a `SOLD_OUT`.
- **BR-6.4 (Gateway Simulado):** O pagamento é simulado, com 95% de aprovação por padrão (`PAYMENT_APPROVAL_RATE`).

## 7. Domínio de Assinaturas por Plano (Release 3)
- **BR-7.1 (Planos):** `diario` (R$ 49,90), `semanal` (R$ 199,90) e `mensal` (R$ 699,90), sempre vinculados a uma padaria.
- **BR-7.2 (Cashback):** 5% do valor pago é creditado como saldo de cashback na assinatura.
- **BR-7.3 (Convivência com o MVP Base):** A assinatura simples dos domínios 1 a 3 (tabela `clientes`) continua valendo e não é alterada pela Release 3.

## 8. Domínio de Agentes de IA (Release 3)
- **BR-8.1 (Previsão de Demanda):** Quantidade sugerida = (média das reservas do produto nos últimos 30 dias, ou 5 sem histórico, + 2 pães por assinatura ativa divididos entre os produtos) × peso do dia da semana.
- **BR-8.2 (Matchmaking):** Score = 50% status (`READY` 100, `BAKING` 80, `SCHEDULED` 40) + 30% proximidade + 20% disponibilidade, dentro do raio informado (padrão 5 km).
- **BR-8.3 (Otimização de Rotas):** Une assinantes ativos e reservas confirmadas do dia (uma parada por consumidor com coordenadas) e ordena pelo vizinho mais próximo a partir da padaria. Tempo estimado: 3 min por km + 5 min por parada.
- **BR-8.4 (Retenção e Upsell):** Quem reservou o mesmo produto ao menos 2 vezes no mesmo dia da semana (últimos 60 dias) recebe um convite quando há fornada `READY` desse produto. Um convite por consumidor.
- **BR-8.5 (Rastreabilidade):** Toda execução de agente grava entrada e saída em `agente_logs`.
