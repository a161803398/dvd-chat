export const ffzEmotesMap = new Map()

export async function fetchFfzChannelEmotes(roomId) {
  const response = await fetch(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${roomId}`)
  if (response === 404) {
    return
  }
  const data = await response.json()
  data.forEach(({ code, id }) => {
    ffzEmotesMap.set(code, id)
  })
}

export function getFfzImg(id) {
  return `https://cdn.frankerfacez.com/emote/${id}/1`
}

window.bttvEmotesMap = ffzEmotesMap
