import { currentLeft, currentTop, maxLeft, maxTop } from './chat'
import { corners } from './corner'
import { increaseCount } from './counter'
import { hitAreaSize, hitSound, speed, volume } from './define'

let lastHitMs = 0
const cornerTimers = []

function delay(cornerId, ms) {
  clearTimeout(cornerTimers[cornerId])
  return new Promise(resolve => {
    cornerTimers[cornerId] = setTimeout(resolve, ms)
  })
}

/*
 corners: 0  1
          2  3
*/
export function getHitCorner() {
  const hitTop = currentTop <= hitAreaSize
  const hitBottom = currentTop >= maxTop - hitAreaSize
  const hitLeft = currentLeft <= hitAreaSize
  const hitRight = currentLeft >= maxLeft - hitAreaSize

  if (hitTop && hitLeft) {
    return 0
  }
  if (hitTop && hitRight) {
    return 1
  }
  if (hitBottom && hitLeft) {
    return 2
  }
  if (hitBottom && hitRight) {
    return 3
  }
  return -1
}

export async function checkHitCorner(ms) {
  // prevent possible double hit when hitAreaSize is larger than zero
  if ((ms - lastHitMs) <= 1000 / speed) {
    return
  }
  const cornerId = getHitCorner()
  if (cornerId !== -1) {
    lastHitMs = ms
    increaseCount(cornerId)
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
}

export function resetLastHit() {
  lastHitMs = performance.now()
}
