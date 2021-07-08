import { currentLeft, currentTop, maxLeft, maxTop, updateChatPosition } from './chat'
import { RAND_RATE, speed } from './define'
import { checkHitCorner } from './hitCheck'

let lastMs = 0

function normalizeD() {
  const hypotenuse = Math.sqrt(dTop * dTop + dLeft * dLeft)
  dTop /= hypotenuse
  dLeft /= hypotenuse
}

let dTop = 1 + (Math.random() - 0.5) * RAND_RATE
let dLeft = 1 + (Math.random() - 0.5) * RAND_RATE

normalizeD()

const MIN_D = 0.3

let requestId = 0

function step(currentMs) {
  const passMs = currentMs - lastMs
  const dMove = speed * passMs / 10
  const newTop = currentTop + dTop * dMove
  const newLeft = currentLeft + dLeft * dMove

  updateChatPosition(newTop, newLeft)

  let hasChanged = false

  if (newTop <= 0 || newTop >= maxTop) {
    dTop *= -1 + (Math.random() - 0.5) * RAND_RATE
    checkHitCorner(currentMs)
    hasChanged = true
  }

  if (newLeft <= 0 || newLeft >= maxLeft) {
    dLeft *= -1 + (Math.random() - 0.5) * RAND_RATE
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
    normalizeD()
  }

  lastMs = currentMs
  requestId = window.requestAnimationFrame(step)
}

export function startMoving() {
  window.cancelAnimationFrame(requestId)
  lastMs = performance.now()
  requestId = window.requestAnimationFrame(step)
}

export function stopMoving() {
  window.cancelAnimationFrame(requestId)
}
