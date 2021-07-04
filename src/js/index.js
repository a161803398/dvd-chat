import '../css/index.css'
import { Client } from 'tmi.js'

const qs = new URLSearchParams(location.search)
const channel = qs.get('channel') || 'hornydragon'
const speed = Number(qs.get('speed')) || 1

const fontSize = Number(qs.get('font-size')) || 24
const lineHeight = fontSize + 8
const imageSize = fontSize - 4
const rawWidth = Number(qs.get('width')) || 420
const rawHeight = Number(qs.get('height')) || 320
const chatWidth = Math.floor(rawWidth / lineHeight) * lineHeight
const chatHeight = Math.floor(rawHeight / lineHeight) * lineHeight

const app = document.getElementById('app')

const START_DEG = Math.PI / 180 * 315
let dTop = -Math.sin(START_DEG)
let dLeft = Math.cos(START_DEG)

let maxTop = app.clientHeight - chatHeight
let maxLeft = app.clientWidth - chatWidth

let currentTop = maxTop / 2
let currentLeft = maxLeft / 2

window.addEventListener('resize', () => {
  maxTop = app.clientHeight - chatHeight
  maxLeft = app.clientWidth - chatWidth
})

function updateChatPosition(top, left) {
  currentTop = Math.min(Math.max(top, 0), maxTop)
  currentLeft = Math.min(Math.max(left, 0), maxLeft)
  chat.style.top = `${currentTop}px`
  chat.style.left = `${currentLeft}px`
}

const chat = document.createElement('div')
chat.className = 'chat'
chat.style.width = `${chatWidth}px`
chat.style.height = `${chatHeight}px`
chat.style.fontSize = `${fontSize}px`
chat.style.lineHeight = `${lineHeight}px`

app.appendChild(chat)

let lastMs = 0
const DECAY_DEG = Math.PI / 180 * 5
const DEG_90 = Math.PI / 2

function step(currentMs) {
  const passMs = currentMs - lastMs
  const dMove = speed * passMs / 10
  const newTop = currentTop + dTop * dMove
  const newLeft = currentLeft + dLeft * dMove

  updateChatPosition(newTop, newLeft)

  let needChange = false

  if (newTop <= 0 || newTop >= maxTop) {
    dTop *= -1 + (Math.random() - 0.5) * 0.1
    checkHitCorner(currentMs)
    needChange = true
  }

  if (newLeft <= 0 || newLeft >= maxLeft) {
    dLeft *= -1 + (Math.random() - 0.5) * 0.1
    checkHitCorner(currentMs)
    needChange = true
  }
  if (needChange) {
    let deg = Math.atan2(-dTop, dLeft)

    // prevent y decay
    if (Math.abs(deg) <= DECAY_DEG) {
      deg *= 2
    }

    // prevent x decay
    if (DEG_90 - DECAY_DEG <= deg && deg <= DEG_90 - DECAY_DEG) {
      deg = (deg - DEG_90) * 2 + DEG_90
    }

    dTop = -Math.sin(deg)
    dLeft = Math.cos(deg)
  }

  lastMs = currentMs
  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)

const client = new Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [`#${channel}`],
})

function removeOldMsg(content) {
  while (content.children.length > 1 && content.scrollTop > chatHeight) { // keep one message or one screen
    content.removeChild(content.firstChild)
  }
  content.scrollBy(0, 1000)
}

function printMessage(html) {
  const node = document.createElement('div')
  node.innerHTML = html
  chat.appendChild(node)
  removeOldMsg(chat)
}

client.addListener('message', (channel, tags, message, self) => {
  printMessage(`<span style="color: ${tags.color}">${tags['display-name']}</span>: ${parseMessage(message, tags)}`)
})

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function parseMessage(message, { emotes }) {
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

let roomState = {}

printMessage('<span class="info">' + [
  `channel: ${channel}`,
  `speed: ${speed}`,
  `font-size: ${fontSize}`,
  `width: ${rawWidth}`,
  `height: ${rawHeight}`,
].join('</span>, <span class="info">') + '</span>')

printMessage('Connecting...')

client.addListener('roomstate', (channel, state) => {
  if (roomState.channel !== channel) {
    printMessage(`Connected to ${channel}.`)
    if (state.slow) {
      printMessage('State: slow mode.')
    }
    if (state['followers-only'] !== -1) {
      printMessage('State: followers-only mode.')
    }
    if (state['emote-only']) {
      printMessage('State: emote-only mode.')
    }
  }
  roomState = state
})

client.connect()
