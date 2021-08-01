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

function getWidth(dom) {
  if (dom.clientHeight >= lineHeight * 1.5) {
    return chatWidth
  } else {
    return dom.clientWidth
  }
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
    const viewHeight = child.offsetTop + child.offsetHeight - scrollTop
    if (viewHeight <= 0) {
      continue
    }
    let childWidth = getWidth(child)
    if (viewHeight <= lineHeight * 1.5 && child.clientHeight >= lineHeight * 1.5) {
      childWidth = probeWidth(child)
    }
    maxWidth = Math.max(maxWidth, childWidth)
  }

  if (chatRealWidth !== maxWidth) {
    chatRealWidth = maxWidth
    updateChatMax()
    updateChatPosition()
  }
}

export function print(html) {
  const node = document.createElement('div')
  node.innerHTML = html
  chat.appendChild(node)
  removeOld(chat)
  if (adaptiveWidth) {
    updateRealWidth(chat)
  }
}
