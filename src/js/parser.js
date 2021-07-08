import { imageSize } from './define'

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function parseMessage(message, { emotes }) {
  if (!emotes) {
    return message
  }
  const emoteList = []
  // flat emotes
  for (const [id, positions] of Object.entries(emotes)) {
    for (const position of positions) {
      const [start, end] = position.split('-')
      emoteList.push({ id, start: Number(start), len: end - start + 1 })
    }
  }

  let pos = 0
  let outputHtml = ''
  while (pos < message.length) {
    const emote = emoteList.find(({ start }) => start === pos)
    if (emote) {
      outputHtml += `<img style="width: ${imageSize}px; height: ${imageSize}px" src="https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0">`
      pos += emote.len
    } else {
      outputHtml += escapeHtml(message[pos])
      pos++
    }
  }
  return outputHtml
}
