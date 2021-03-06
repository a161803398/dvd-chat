import { imageSize } from './define'
import { bttvEmotesMap, getBttvImg } from './bttv'
import { ffzEmotesMap, getFfzImg } from './ffz'
import { escapeHtml } from './utils'
import { badges } from './badge'

function findAllIndexes(str, val) {
  const indexes = []
  let i = -val.length
  while ((i = str.indexOf(val, i + val.length)) !== -1) {
    indexes.push(i)
  }
  return indexes
}

function putEmotes(tar, src, message, type) {
  for (const [code, id] of src.entries()) {
    for (const start of findAllIndexes(message, code)) {
      const end = start + code.length
      if (
        (start === 0 || message[start - 1] === ' ') &&
        (end === message.length || message[end] === ' ')
      ) {
        tar.push({ id, start, len: code.length, type })
      }
    }
  }
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
  putEmotes(emoteList, bttvEmotesMap, message, 'bttv')
  putEmotes(emoteList, ffzEmotesMap, message, 'ffz')

  let pos = 0
  let outputHtml = ''
  while (pos < message.length) {
    const emote = emoteList.find(({ start }) => start === pos)
    if (emote) {
      const imgSrc = emote.type === 'twitch'
        ? `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0`
        : emote.type === 'bttv' ? getBttvImg(emote.id) : getFfzImg(emote.id)

      outputHtml += `<img style="width: ${imageSize}px; height: ${imageSize}px" src="${imgSrc}">`
      pos += emote.len
    } else {
      outputHtml += escapeHtml(message[pos])
      pos++
    }
  }
  return outputHtml
}

export function parseBadges(badgesInfo) {
  return badgesInfo
    ? Object.entries(badgesInfo)
      .map(([key, value]) => badges.get(key)?.get(value))
      .filter(url => url) // TODO: find out why some url is undefined
      .map(url => `<img style="width: ${imageSize}px; height: ${imageSize}px" src="${url}">`)
      .join(' ') + ' '
    : ''
}
