import { app, counterHeight, counterFontSize, counterPadding } from './define'

const counts = [0, 0, 0, 0]
const sessionCounts = [0, 0, 0, 0]

function saveCounts() {
  localStorage.setItem('counts', JSON.stringify(counts))
}

function createCornerCounter(alignLeft = true) {
  const counter = document.createElement('div')
  counter.className = 'counter'
  counter.style.height = `${counterHeight}px`
  counter.style.lineHeight = `${counterHeight}px`
  counter.style.fontSize = `${counterFontSize}px`
  counter.style.textAlign = alignLeft ? 'left' : 'right'
  counter.style.flexDirection = alignLeft ? 'row' : 'row-reverse'
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

function updateCounterText(idx: number) {
  counters[idx].innerHTML = ''
  counters[idx].appendChild(document.createTextNode(`${sessionCounts[idx]}`))

  const totalCount = document.createElement('span')
  totalCount.style.fontSize = `${counterFontSize * 0.7}px`
  totalCount.style.margin = '0 10px'
  totalCount.innerText = `(${counts[idx]})`

  counters[idx].appendChild(totalCount)
}

function loadCountHistory() {
  try {
    const saveData = JSON.parse(localStorage.getItem('counts')!)
    for (let i = 0; i < counts.length; i++) {
      counts[i] = Number.isFinite(saveData[i]) ? saveData[i] : 0
      counters[i].innerText = `${counts[i]}`
    }
  } catch {
    saveCounts()
  }
}

loadCountHistory()

for (let i = 0; i < counts.length; i++) {
  updateCounterText(i)
}

function updateCounter(idx: number, top: number) {
  counters[idx].style.transform = `translate(0, ${top}px)`
}

export function updateCounterPosition() {
  updateCounter(0, 0)
  updateCounter(1, 0)
  updateCounter(2, app.clientHeight - counterHeight)
  updateCounter(3, app.clientHeight - counterHeight)
}

export function increaseCount(idx: number) {
  sessionCounts[idx]++
  counts[idx]++
  updateCounterText(idx)
  saveCounts()
}
