import { EmoteCodeId } from './type'

export const ffzEmotesMap = new Map<string, string>()

export async function fetchFfzChannelEmotes(roomId: string) {
  const response = await fetch(
    `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${roomId}`
  )
  if (response.status === 404) {
    return
  }
  const data: EmoteCodeId[] = await response.json()
  data.forEach(({ code, id }) => {
    ffzEmotesMap.set(code, id)
  })
}

export function getFfzImg(id: string) {
  return `https://cdn.frankerfacez.com/emote/${id}/1`
}
