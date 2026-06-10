export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: unknown): string {
  if (!date) return '—'
  let d: Date
  if (date instanceof Date) {
    d = date
  } else if (typeof date === 'object' && 'toDate' in (date as object)) {
    // Firestore Timestamp
    d = (date as { toDate(): Date }).toDate()
  } else if (typeof date === 'number') {
    d = new Date(date)
  } else {
    d = new Date(date as string)
  }
  if (isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
