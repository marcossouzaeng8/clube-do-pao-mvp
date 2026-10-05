const defaultApprovalRate = 0.95
const cashbackRate = 0.05

// Gateway simulado (ADR 003): nenhuma cobranca real e feita.
export async function processPayment() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const approved = Math.random() < Number(process.env.PAYMENT_APPROVAL_RATE ?? defaultApprovalRate)
  return {
    success: approved,
    externalId: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: approved ? 'APPROVED' : 'FAILED',
  }
}

export function calculateCashback(amount) {
  return Math.round(amount * cashbackRate * 100) / 100
}
