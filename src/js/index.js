import '../css/index.css'
import { Client } from 'tmi.js'
import { Howl } from 'howler'
import hit from '../assets/hit.ogg'
const hitSound = new Howl({ src: hit })

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

const counterFontSize = Number(qs.get('counter-size')) || 32
const counterPadding = Number(qs.get('counter-padding')) || 12
const counterWidth = counterFontSize * 4
const counterHeight = counterFontSize + counterPadding

function createCorner() {
  const corner = document.createElement('div')
  corner.className = 'corner'
  app.appendChild(corner)
  return corner
}

const corners = [
  createCorner(),
  createCorner(),
  createCorner(),
  createCorner(),
]

function updateCorner(idx, top, left) {
  const corner = corners[idx]
  corner.style.top = `${top}px`
  corner.style.left = `${left}px`
}

function updateCornerPosition() {
  updateCorner(0, 0, 0)
  updateCorner(1, 0, app.clientWidth)
  updateCorner(2, app.clientHeight, 0)
  updateCorner(3, app.clientHeight, app.clientWidth)
}

updateCornerPosition()

function createCornerCounter(alignLeft = true) {
  const counter = document.createElement('div')
  counter.className = 'counter'
  counter.style.width = `${counterWidth}px`
  counter.style.height = `${counterHeight}px`
  counter.style.lineHeight = `${counterHeight}px`
  counter.style.fontSize = `${counterFontSize}px`
  counter.style.textAlign = alignLeft ? 'left' : 'right'
  counter.style.padding = `0 ${counterPadding}px`
  counter.innerText = 0
  app.appendChild(counter)
  return counter
}

const counters = [
  createCornerCounter(),
  createCornerCounter(false),
  createCornerCounter(),
  createCornerCounter(false),
]

function updateCounter(idx, top, left) {
  const corner = counters[idx]
  corner.style.top = `${top}px`
  corner.style.left = `${left}px`
}

function updateCounterPosition() {
  updateCounter(0, 0, 0)
  updateCounter(1, 0, app.clientWidth - counterWidth)
  updateCounter(2, app.clientHeight - counterHeight, 0)
  updateCounter(3, app.clientHeight - counterHeight, app.clientWidth - counterWidth)
}

updateCounterPosition()

window.addEventListener('resize', () => {
  maxTop = app.clientHeight - chatHeight
  maxLeft = app.clientWidth - chatWidth
  updateCornerPosition()
  updateCounterPosition()
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
let lastHitMs = 0

const cornerTimers = []

function delay(cornerId, ms) {
  clearTimeout(cornerTimers[cornerId])
  return new Promise(resolve => {
    cornerTimers[cornerId] = setTimeout(resolve, ms)
  })
}

async function checkHitCorner(ms) {
  if ((ms - lastHitMs) < (10 / speed)) {
    const hitTop = currentTop < maxTop / 2
    const hitLeft = currentLeft < maxLeft / 2
    const cornerId = hitTop ? (hitLeft ? 0 : 1) : (hitLeft ? 2 : 3)
    const counter = counters[cornerId]
    counter.innerText = Number(counter.innerText) + 1
    const corner = corners[cornerId]
    hitSound.play()
    corner.classList.remove('fade')
    corner.classList.add('show')

    await delay(cornerId, 1000)
    corner.classList.remove('show')
    corner.classList.add('fade')
    await delay(cornerId, 10 * 1000)
    corner.classList.remove('fade')
  }
  lastHitMs = ms
}

const MIN_D = 0.2

let requestId = 0

function step(currentMs) {
  const passMs = currentMs - lastMs
  const dMove = speed * passMs / 10
  const newTop = currentTop + dTop * dMove
  const newLeft = currentLeft + dLeft * dMove

  updateChatPosition(newTop, newLeft)

  let hasChanged = false

  if (newTop <= 0 || newTop >= maxTop) {
    dTop *= -1 + (Math.random() - 0.5) * 0.1
    checkHitCorner(currentMs)
    hasChanged = true
  }

  if (newLeft <= 0 || newLeft >= maxLeft) {
    dLeft *= -1 + (Math.random() - 0.5) * 0.1
    checkHitCorner(currentMs)
    hasChanged = true
  }

  if (hasChanged) {
    // prevent y decay
    if (Math.abs(dTop) < MIN_D) {
      dTop = dTop > 0 ? MIN_D : -MIN_D
    }
    // prevent x decay
    if (Math.abs(dLeft) < MIN_D) {
      dLeft = dLeft > 0 ? MIN_D : -MIN_D
    }
    const deg = Math.atan2(-dTop, dLeft)
    dTop = -Math.sin(deg)
    dLeft = Math.cos(deg)
  }

  lastMs = currentMs
  requestId = window.requestAnimationFrame(step)
}

requestId = window.requestAnimationFrame(step)

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    lastMs = performance.now()
    window.cancelAnimationFrame(requestId)
    requestId = window.requestAnimationFrame(step)
  } else {
    window.cancelAnimationFrame(requestId)
  }
})

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
