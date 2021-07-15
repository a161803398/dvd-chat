import { Client } from 'tmi.js'
import { fetchBttvChannelEmotes, fetchBttvGlobalEmotes } from './bttv'
import { fetchFfzChannelEmotes } from './ffz'
import { fetchGlobalBadges, fetchChannelBadges } from './badge'
import { print } from './chat'
import { channel, counterFontSize, fontSize, rawHeight, rawWidth, speed, volume } from './define'
import { parseBadges, parseMessage } from './parser'

const client = new Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [`#${channel}`],
})

client.addListener('message', (channel, tags, message, self) => {
  print(parseBadges(tags.badges) + `<span style="color: ${tags.color ?? '#f0e68c'}">${tags['display-name']}</span>: ${parseMessage(message, tags)}`)
})

let roomState = {}

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
    if (state['followers-only'] !== -1) {
      print('State: followers-only mode.')
    }
    if (state['emote-only']) {
      print('State: emote-only mode.')
    }
    await Promise.all([
      globalFetchingPromise,
      fetchBttvChannelEmotes(state['room-id']),
      fetchFfzChannelEmotes(state['room-id']),
      fetchChannelBadges(state['room-id']),
    ])
    print('Emotes and Badges info fetched.')
  }
  roomState = state
})

export function connect() {
  print('<span class="info">' + [
    `channel: ${channel}`,
    `speed: ${speed}`,
    `font-size: ${fontSize}`,
    `width: ${rawWidth}`,
    `height: ${rawHeight}`,
    `volume: ${volume}`,
    `counter-size: ${counterFontSize}`,
  ].join('</span> <span class="info">') + '</span>')

  print('Connecting...')

  client.connect()
}
