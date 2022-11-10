import './css/index.css'
import { updateChatMax, updateChatPosition } from './lib/chat'
import { connect } from './lib/client'
import { updateCornerPosition } from './lib/corner'
import { updateCounterPosition } from './lib/counter'
import { resetLastHit } from './lib/hitCheck'
import { startMoving, stopMoving } from './lib/move'

updateCornerPosition()
updateCounterPosition()

window.addEventListener('resize', () => {
  resetLastHit() // prevent false hit effect
  updateChatMax()
  updateChatPosition()
  updateCornerPosition()
  updateCounterPosition()
})

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    startMoving()
  } else {
    stopMoving()
  }
})
if (document.visibilityState === 'visible') {
  startMoving()
}
connect()
