export const bttvEmotesMap = new Map()

export async function fetchBttvGlobalEmotes() {
  const response = await fetch('https://api.betterttv.net/3/cached/emotes/global')
  const data = await response.json()
  data.forEach(({ code, id }) => {
    bttvEmotesMap.set(code, id)
  })
}

export async function fetchBttvChannelEmotes(roomId) {
  const response = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${roomId}`)
  const data = await response.json()
  data.channelEmotes.forEach(({ code, id }) => {
    bttvEmotesMap.set(code, id)
  })
  data.sharedEmotes.forEach(({ code, id }) => {
    bttvEmotesMap.set(code, id)
  })
}

export function getBttvImg(id) {
  return `https://cdn.betterttv.net/emote/${id}/1x`
}
