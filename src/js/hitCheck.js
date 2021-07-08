import { hitSound, threshold, speed, volume } from './define'
import { currentTop, currentLeft, maxTop, maxLeft } from './chat'
import { counters } from './counter'
import { corners } from './corner'

let lastHitMs = 0
const cornerTimers = []

function delay(cornerId, ms) {
  clearTimeout(cornerTimers[cornerId])
  return new Promise(resolve => {
    cornerTimers[cornerId] = setTimeout(resolve, ms)
  })
}

export async function checkHitCorner(ms) {
  if ((ms - lastHitMs) < (threshold / speed)) {
    const hitTop = currentTop < maxTop / 2
    const hitLeft = currentLeft < maxLeft / 2
    const cornerId = hitTop ? (hitLeft ? 0 : 1) : (hitLeft ? 2 : 3)
    const counter = counters[cornerId]
    counter.innerText = Number(counter.innerText) + 1
    const corner = corners[cornerId]
    if (volume > 0) {
      hitSound.play()
    }
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

export function resetLastHit() {
  lastHitMs = 0
}
