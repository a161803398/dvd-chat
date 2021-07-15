export const badges = new Map()

function mapVersion(versions) {
  const versionUrlMap = new Map()
  Object.entries(versions).forEach(([key, value]) => {
    versionUrlMap.set(key, value.image_url_1x)
  })
  return versionUrlMap
}

async function fetchBadgesFromUrl(url) {
  const response = await fetch(url)
  const data = await response.json()
  Object.entries(data.badge_sets).forEach(([key, value]) => {
    badges.set(key, mapVersion(value.versions))
  })
}

export async function fetchGlobalBadges() {
  await fetchBadgesFromUrl('https://badges.twitch.tv/v1/badges/global/display')
}

export async function fetchChannelBadges(roomId) {
  await fetchBadgesFromUrl(`https://badges.twitch.tv/v1/badges/channels/${roomId}/display`)
}

window.badges = badges
