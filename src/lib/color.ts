const colorPalette = [
  '#B5EAEA',
  '#FFBCBC',
  '#F38BA0',
  '#FFEACA',
  '#ECD662',
  '#D9DD6B',
  '#50CB93',
  '#7DEDFF',
  '#7C83FD',
  '#FB7AFC',
  '#C9E4C5',
  '#F08A5D',
  '#00B8A9',
  '#E0F9B5',
  '#9DF3C4',
  '#F85F73',
  '#FF9A3C',
  '#C9B6E4',
  '#968C83',
  '#84A9AC',
  '#35D0BA',
  '#7579E7',
  '#A1DE93',
  '#70A1D7',
  '#9A0F98',
  '#C6E377',
  '#8D93AB',
  '#EFDFBF',
  '#74B49B',
  '#F0E68C',
]

function oatHash(str = '') {
  let num = 0
  for (let i = 0; i < str.length; i++) {
    num += str.charCodeAt(i)
    num += num << 10
    num ^= num >> 6
  }
  num += num << 3
  num ^= num >> 11
  return ((num + (num << 15)) & 4294967295) >>> 0
}

export function getColor(name: string | undefined) {
  return colorPalette[oatHash(name) % colorPalette.length]
}
