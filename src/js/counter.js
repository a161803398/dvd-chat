import { app, counterWidth, counterHeight, counterFontSize, counterPadding } from './define'

const counts = [0, 0, 0, 0]

function saveCounts() {
  localStorage.setItem('counts', JSON.stringify(counts))
}

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

const counters = [
  createCornerCounter(),
  createCornerCounter(false),
  createCornerCounter(),
  createCornerCounter(false),
]

function loadCountHistory() {
  try {
    const saveData = JSON.parse(localStorage.getItem('counts'))
    for (let i = 0; i < counts.length; i++) {
      counts[i] = Number.isFinite(saveData[i]) ? saveData[i] : 0
      counters[i].innerText = counts[i]
    }
  } catch {
    saveCounts()
  }
}

loadCountHistory()

function updateCounter(idx, top, left) {
  counters[idx].style.transform = `translate(${left}px, ${top}px)`
}

export function updateCounterPosition() {
  updateCounter(0, 0, 0)
  updateCounter(1, 0, app.clientWidth - counterWidth)
  updateCounter(2, app.clientHeight - counterHeight, 0)
  updateCounter(3, app.clientHeight - counterHeight, app.clientWidth - counterWidth)
}

export function increaseCount(idx) {
  counters[idx].innerText = ++counts[idx]
  saveCounts()
}
