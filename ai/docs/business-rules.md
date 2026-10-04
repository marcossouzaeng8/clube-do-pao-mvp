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