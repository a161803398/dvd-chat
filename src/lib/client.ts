import { Client, RoomState } from 'tmi.js'
import { fetchBttvChannelEmotes, fetchBttvGlobalEmotes } from './bttv'
import { fetchFfzChannelEmotes } from './ffz'
import { fetchGlobalBadges, fetchChannelBadges } from './badge'
import { print } from './chat'
import { getColor } from './color'
import {
  adaptiveWidth,
  channel,
  counterFontSize,
  fontSize,
  rawHeight,
  rawWidth,
  speed,
  volume,
} from './define'
import { parseBadges, parseMessage } from './parser'

const client = new Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [`#${channel}`],
})

client.addListener('message', (_channel, tags, message, _self) => {
  print(
    parseBadges(tags.badges) +
      `<span style="color: ${tags.color ?? getColor(tags['display-name'])}">${
        tags['display-name']
      }</span>: ${parseMessage(message, tags)}`
  )
})

let roomState: {
  channel?: string
  state?: RoomState
} = {}

const globalFetchingPromise = Promise.all([
  fetchBttvGlobalEmotes(),
  fetchGlobalBadges(),
])

client.addListener('roomstate', async (channel, state) => {
  if (roomState.channel !== channel) {
    print(`Connected to ${channel}.`)
    if (state.slow) {
      print('State: slow mode.')
    }
    if (state['followers-only']) {
      print('State: followers-only mode.')
    }
    if (state['emote-only']) {
      print('State: emote-only mode.')
    }
    const roomId = state['room-id']!
    await Promise.all([
      globalFetchingPromise,
      fetchBttvChannelEmotes(roomId),
      fetchFfzChannelEmotes(roomId),
      fetchChannelBadges(roomId),
    ])
    print('Emotes and Badges info fetched.')
  }
  roomState = state
})

export function connect() {
  print(
    '<span class="info">' +
      [
        `channel: ${channel}`,
        `speed: ${speed}`,
        `font-size: ${fontSize}`,
        `width: ${rawWidth}`,
        `height: ${rawHeight}`,
        `volume: ${volume}`,
        `counter-size: ${counterFontSize}`,
        `adaptive-width: ${adaptiveWidth}`,
      ].join('</span> <span class="info">') +
      '</span>'
  )

  print('Connecting...')

  client.connect()
}
