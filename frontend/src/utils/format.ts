export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", options ?? { month: "short", day: "numeric", year: "numeric" })
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now()
  const then = typeof date === "string" ? new Date(date).getTime() : date.getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30) return `${diffDay}d ago`
  return formatDate(date)
}

export function formatNumber(num: number): string {
  return num.toLocaleString("en-US")
}
