import '../css/index.css'
import { updateChatMax, updateChatPosition } from './chat'
import { connect } from './client'
import { updateCornerPosition } from './corner'
import { updateCounterPosition } from './counter'
import { resetLastHit } from './hitCheck'
import { startMoving, stopMoving } from './move'

updateCornerPosition()
updateCounterPosition()

window.addEventListener('resize', () => {
  resetLastHit() // prevent false hit effect
  updateChatMax()
  updateChatPosition()
  updateCornerPosition()
  updateCounterPosition()
})

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    startMoving()
  } else {
    stopMoving()
  }
})
startMoving()
connect()
