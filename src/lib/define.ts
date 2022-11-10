import { Howl } from 'howler'
import hit from '../assets/hit.ogg'
import { minMax } from './utils'

export const app = document.getElementById('app')!

const qs = new URLSearchParams(location.search)
export const channel = qs.get('channel') || 'hornydragon'
export const speed = Number(qs.get('speed')) || 1
export const volume = minMax(Number(qs.get('volume') ?? 1), 0, 1)
export const hitSound = new Howl({ src: hit, volume })

export const fontSize = Number(qs.get('font-size')) || 24
export const lineHeight = fontSize + 8
export const imageSize = fontSize
export const rawWidth = Number(qs.get('width')) || 420
export const rawHeight = Number(qs.get('height')) || 320
export const chatWidth = Math.floor(rawWidth / lineHeight) * lineHeight
export const chatHeight = Math.floor(rawHeight / lineHeight) * lineHeight

export const RAND_RATE = 0.1
export const hitAreaSize = Number(qs.get('hit-area-size')) || 4
export const counterFontSize = Number(qs.get('counter-size')) || 32
export const counterPadding = Number(qs.get('counter-padding')) || 12
export const counterHeight = counterFontSize + counterPadding
export const adaptiveWidth = Boolean(qs.get('adaptive-width')) || true
