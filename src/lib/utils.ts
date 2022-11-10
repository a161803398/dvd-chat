export function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function minMax(num: number, min: number, max: number) {
  if (Number.isNaN(num)) {
    return max
  }
  return Math.max(Math.min(num, max), min)
}
