export const badges = new Map()

type Versions = Record<string, { image_url_1x: string }>
function mapVersion(versions: Versions) {
  const versionUrlMap = new Map()
  Object.entries(versions).forEach(([key, value]) => {
    versionUrlMap.set(key, value.image_url_1x)
  })
  return versionUrlMap
}

async function fetchBadgesFromUrl(url: string) {
  const response = await fetch(url)
  const data: { badge_sets: Record<string, { versions: Versions }> } =
    await response.json()
  Object.entries(data.badge_sets).forEach(([key, value]) => {
    badges.set(key, mapVersion(value.versions))
  })
}

export async function fetchGlobalBadges() {
  await fetchBadgesFromUrl('https://badges.twitch.tv/v1/badges/global/display')
}

export async function fetchChannelBadges(roomId: string) {
  await fetchBadgesFromUrl(
    `https://badges.twitch.tv/v1/badges/channels/${roomId}/display`
  )
}
