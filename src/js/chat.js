import { adaptiveWidth, app, chatHeight, chatWidth, fontSize, lineHeight } from './define'
import { minMax } from './utils'

export let maxTop = app.clientHeight - chatHeight
export let maxLeft = app.clientWidth - chatWidth

export let currentTop = maxTop / 2
export let currentLeft = maxLeft / 2

let chatRealWidth = chatWidth

export function updateChatMax() {
  maxTop = app.clientHeight - chatHeight
  maxLeft = app.clientWidth - chatRealWidth
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
  content.scrollBy(0, content.scrollHeight)
}

function probeWidth(dom) {
  const probe = document.createElement('span')
  dom.appendChild(probe)
  const { offsetLeft } = probe
  dom.removeChild(probe)
  return offsetLeft
}

function updateRealWidth(content) {
  const { scrollTop, children } = content
  let maxWidth = 0
  for (const child of children) {
    const viewHeight = child.offsetTop + child.clientHeight - scrollTop
    if (viewHeight <= 0) {
      continue
    }
    const childWidth = (viewHeight <= lineHeight * 1.5 && child.clientHeight >= lineHeight * 1.5)
      ? probeWidth(child)
      : child.clientWidth

    maxWidth = Math.max(maxWidth, childWidth)
  }

  if (chatRealWidth !== maxWidth) {
    chatRealWidth = Math.min(maxWidth, chatWidth)
    updateChatMax()
    updateChatPosition()
  }
}

export function print(html) {
  const node = document.createElement('div')
  node.innerHTML = html
  chat.appendChild(node)

  if (node.clientHeight >= lineHeight * 1.5) {
    // try to get real width when multiline

    const initHeight = node.clientHeight
    const initWidth = node.clientWidth
    const pWidth = probeWidth(node)

    let bestWidth = node.clientWidth
    for (;;) {
      node.style.width = `${bestWidth - 1}px`
      if (node.clientHeight !== initHeight || probeWidth(node) !== pWidth) {
        break
      }
      bestWidth--
    }
    if (bestWidth !== initWidth) {
      node.style.width = `${bestWidth}px`
    } else {
      node.style.removeProperty('width')
    }
  }

  removeOld(chat)
  if (adaptiveWidth) {
    updateRealWidth(chat)
  }
}
