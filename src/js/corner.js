import { app } from './define'

function createCorner() {
  const corner = document.createElement('div')
  corner.className = 'corner'
  app.appendChild(corner)
  return corner
}

export const corners = [
  createCorner(),
  createCorner(),
  createCorner(),
  createCorner(),
]

function updateCorner(idx, top, left) {
  corners[idx].style.transform = `translate(${left}px, ${top}px)`
}

export function updateCornerPosition() {
  updateCorner(0, 0, 0)
  updateCorner(1, 0, app.clientWidth)
  updateCorner(2, app.clientHeight, 0)
  updateCorner(3, app.clientHeight, app.clientWidth)
}
