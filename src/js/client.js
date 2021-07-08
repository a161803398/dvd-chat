import { Client } from 'tmi.js'
import { fetcthBttvChannelEmotes, fetcthBttvGlobalEmotes } from './bttv'
import { print } from './chat'
import { channel, counterFontSize, fontSize, rawHeight, rawWidth, speed, volume } from './define'
import { parseMessage } from './parser'

const client = new Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [`#${channel}`],
})

client.addListener('message', (channel, tags, message, self) => {
  print(`<span style="color: ${tags.color ?? '#f0e68c'}">${tags['display-name']}</span>: ${parseMessage(message, tags)}`)
})

let roomState = {}

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
    await fetcthBttvChannelEmotes(state['room-id'])
    print('BTTV channel emotes info fetched.')
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
  fetcthBttvGlobalEmotes()

  client.connect()
}
