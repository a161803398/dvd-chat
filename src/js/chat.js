import { app, chatWidth, chatHeight, fontSize, lineHeight } from './define'
import { minMax } from './utils'

export let maxTop = app.clientHeight - chatHeight
export let maxLeft = app.clientWidth - chatWidth

export let currentTop = maxTop / 2
export let currentLeft = maxLeft / 2

export function updateChatMax() {
  maxTop = app.clientHeight - chatHeight
  maxLeft = app.clientWidth - chatWidth
}

export const chat = document.createElement('div')
chat.className = 'chat'
chat.style.width = `${chatWidth}px`
chat.style.height = `${chatHeight}px`
chat.style.fontSize = `${fontSize}px`
chat.style.lineHeight = `${lineHeight}px`

app.appendChild(chat)

export function updateChatPosition(top = currentTop, left = currentLeft) {
  currentTop = minMax(top, 0, maxTop)
  currentLeft = minMax(left, 0, maxLeft)
  chat.style.transform = `translate(${currentLeft}px, ${currentTop}px)`
}

function removeOld(content) {
  while (content.children.length > 1 && content.scrollTop > chatHeight) { // keep one message or one screen
    content.removeChild(content.firstChild)
  }
  content.scrollBy(0, 1000)
}

export function print(html) {
  const node = document.createElement('div')
  node.innerHTML = html
  chat.appendChild(node)
  removeOld(chat)
}
