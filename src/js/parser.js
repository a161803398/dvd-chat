import { imageSize } from './define'
import { bttvEmotesMap, getBttvImg } from './bttv'

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function findAllIndexes(str, val) {
  const indexes = []
  let i = -val.length
  while ((i = str.indexOf(val, i + val.length)) !== -1) {
    indexes.push(i)
  }
  return indexes
}

export function parseMessage(message, { emotes }) {
  const emoteList = []
  if (emotes) {
  // flat emotes
    for (const [id, positions] of Object.entries(emotes)) {
      for (const position of positions) {
        const [start, end] = position.split('-')
        emoteList.push({ id, start: Number(start), len: end - start + 1, type: 'twitch' })
      }
    }
  }

  for (const [code, id] of bttvEmotesMap.entries()) {
    for (const start of findAllIndexes(message, code)) {
      emoteList.push({ id, start, len: id.length, type: 'bttv' })
    }
  }

  let pos = 0
  let outputHtml = ''
  while (pos < message.length) {
    const emote = emoteList.find(({ start }) => start === pos)
    if (emote) {
      const imgSrc = emote.type === 'twitch' ? `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0` : getBttvImg(emote.id)
      outputHtml += `<img style="width: ${imageSize}px; height: ${imageSize}px" src="${imgSrc}">`
      pos += emote.len
    } else {
      outputHtml += escapeHtml(message[pos])
      pos++
    }
  }
  return outputHtml
}
