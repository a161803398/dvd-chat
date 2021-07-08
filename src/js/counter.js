import { app, counterWidth, counterHeight, counterFontSize, counterPadding } from './define'

function createCornerCounter(alignLeft = true) {
  const counter = document.createElement('div')
  counter.className = 'counter'
  counter.style.width = `${counterWidth}px`
  counter.style.height = `${counterHeight}px`
  counter.style.lineHeight = `${counterHeight}px`
  counter.style.fontSize = `${counterFontSize}px`
  counter.style.textAlign = alignLeft ? 'left' : 'right'
  counter.style.padding = `0 ${counterPadding}px`
  app.appendChild(counter)
  return counter
}

export const counters = [
  createCornerCounter(),
  createCornerCounter(false),
  createCornerCounter(),
  createCornerCounter(false),
]

function updateCounter(idx, top, left) {
  counters[idx].style.transform = `translate(${left}px, ${top}px)`
}

export function updateCounterPosition() {
  updateCounter(0, 0, 0)
  updateCounter(1, 0, app.clientWidth - counterWidth)
  updateCounter(2, app.clientHeight - counterHeight, 0)
  updateCounter(3, app.clientHeight - counterHeight, app.clientWidth - counterWidth)
}
