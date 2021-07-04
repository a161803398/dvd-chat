import '../css/index.css'

const CHAT_WIDTH = 400
const CHAT_HEIGHT = 300
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
