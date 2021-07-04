import '../css/index.css'
import { Client } from 'tmi.js'

const CHAT_WIDTH = 416
const CHAT_HEIGHT = 320
const app = document.getElementById('app')
const speed = 0.1
let deg = 2 * Math.PI * (-45 / 360)

let maxTop = app.clientHeight - CHAT_HEIGHT
let maxLeft = app.clientWidth - CHAT_WIDTH

let currentTop = maxTop / 2
let currentLeft = maxLeft / 2

window.addEventListener('resize', () => {
  maxTop = app.clientHeight - CHAT_HEIGHT
  maxLeft = app.clientWidth - CHAT_WIDTH
})

function updateChatPosition(top, left) {
  currentTop = Math.min(Math.max(top, 0), maxTop)
  currentLeft = Math.min(Math.max(left, 0), maxLeft)
  chat.style.top = `${currentTop}px`
  chat.style.left = `${currentLeft}px`
}

const chat = document.createElement('div')
chat.className = 'chat'
chat.style.width = `${CHAT_WIDTH}px`
chat.style.height = `${CHAT_HEIGHT}px`
app.appendChild(chat)

let lastMs = 0
function step(currentMs) {
  const passMs = currentMs - lastMs
  const dMove = speed * passMs

  let dTop = -Math.sin(deg)
  let dLeft = Math.cos(deg)

  const newTop = currentTop + dTop * dMove
  const newLeft = currentLeft + dLeft * dMove

  updateChatPosition(newTop, newLeft)

  if (newTop <= 0 || newTop >= maxTop) {
    dTop *= -1 + (Math.random() - 0.5) * 0.1
  }

  if (newLeft <= 0 || newLeft >= maxLeft) {
    dLeft *= -1 + (Math.random() - 0.5) * 0.1
  }
  deg = Math.atan2(-dTop, dLeft)

  lastMs = currentMs
  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)

const client = new Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: ['#hornydragon'],
})

function removeOldMsg(content) {
  while ((content.offsetTop + content.offsetHeight - content.firstChild.offsetHeight) > app.innerHeight) {
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
  console.log(tags)
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
      outputHtml += `<img class="emote" src="https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/3.0">`
      pos += emote.len
    } else {
      outputHtml += escapeHtml(message[pos])
      pos++
    }
  }
  return outputHtml
}

let roomState = ''

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
