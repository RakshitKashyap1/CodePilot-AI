export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-500"
  if (score >= 75) return "text-yellow-500"
  return "text-red-500"
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-green-500"
  if (score >= 75) return "bg-yellow-500"
  return "bg-red-500"
}
