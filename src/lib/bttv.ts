import { EmoteCodeId } from './type'

export const bttvEmotesMap = new Map<string, string>()

export async function fetchBttvGlobalEmotes() {
  const response = await fetch(
    'https://api.betterttv.net/3/cached/emotes/global'
  )
  const data: EmoteCodeId[] = await response.json()
  data.forEach(({ code, id }) => {
    bttvEmotesMap.set(code, id)
  })
}

export async function fetchBttvChannelEmotes(roomId: string) {
  const response = await fetch(
    `https://api.betterttv.net/3/cached/users/twitch/${roomId}`
  )
  if (response.status === 404) {
    return
  }
  const data: {
    channelEmotes: EmoteCodeId[]
    sharedEmotes: EmoteCodeId[]
  } = await response.json()
  data.channelEmotes.forEach(({ code, id }) => {
    bttvEmotesMap.set(code, id)
  })
  data.sharedEmotes.forEach(({ code, id }) => {
    bttvEmotesMap.set(code, id)
  })
}

export function getBttvImg(id: string) {
  return `https://cdn.betterttv.net/emote/${id}/1x`
}
