import { Check, CircleAlert } from 'lucide-react'

export default function Feedback({ feedback, className = '' }) {
  if (!feedback) return null

  return feedback.type === 'error'
    ? <p className={`error-message ${className}`} role="alert"><CircleAlert size={17} />{feedback.text}</p>
    : <p className={`success-message ${className}`} role="status"><Check size={17} strokeWidth={3} />{feedback.text}</p>
}
