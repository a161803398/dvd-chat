export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function minMax(num, min, max) {
  if (Number.isNaN(num)) {
    return max
  }
  return Math.max(Math.min(num, max), min)
}
