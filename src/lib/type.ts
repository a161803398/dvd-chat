export type EmoteCodeId = { code: string; id: string }
export type EmoteType = 'twitch' | 'bttv' | 'ffz'
export type Emote = {
  id: string
  start: number
  len: number
  type: EmoteType
}
