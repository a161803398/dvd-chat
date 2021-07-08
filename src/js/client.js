import { Client } from 'tmi.js'
import { channel, speed, fontSize, rawWidth, rawHeight } from './define'
import { parseMessage } from './parser'
import { print } from './chat'

const client = new Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [`#${channel}`],
})

client.addListener('message', (channel, tags, message, self) => {
  print(`<span style="color: ${tags.color}">${tags['display-name']}</span>: ${parseMessage(message, tags)}`)
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
  ].join('</span>, <span class="info">') + '</span>')

  print('Connecting...')
  client.connect()
}
