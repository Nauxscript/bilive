import readline from 'readline'
import say from 'say'
import chalk from 'chalk'
import { circleNumber, guardLevelMap } from './dictMap'
import type { BasicMessage } from './types'

export const debouce = <T = unknown>(cb: (args: T) => void, time?: number) => {
  let timer: NodeJS.Timeout
  return (args: T) => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      cb(args)
    }, time)
  }
}

export const debouceSpeak = debouce((content: string) => {
  say.speak(content)
})

export const sligleLineConsole = (message: any) => {
  // delele current line
  readline.clearLine(process.stdout, 0)
  // move cursor to line head
  readline.cursorTo(process.stdout, 0, 0)
  // output
  process.stdout.write(message, 'utf-8')
}

export const generateIdentity = (msg: BasicMessage) => {
  if (!msg.body.user.identity)
    return ''
  let idStr = ''
  const { rank, guard_level, room_admin } = msg.body.user.identity
  rank && (idStr += `${circleNumber[rank - 1]} `)
  guard_level && (idStr += guardLevelMap[guard_level])
  room_admin && (idStr += (idStr && '|' + '房管'))
  return idStr ? `(${idStr})` : ''
}

export const generateBadge = (msg: BasicMessage) => {
  if (!msg.body.user.badge)
    return ''
  let badgeStr = ''
  const { badge } = msg.body.user
  const lv = `lv.${badge.level} · `
  // 名字颜色
  badgeStr = `[${lv}${badge.name}]`

  // 点亮
  badge.active && (badgeStr = chalk.bgHex(badge.color).inverse(badgeStr))
  return badgeStr
}

export const generateBulletName = (msg: BasicMessage) => {
  const nameStr = msg.body.user.uname
  const idStr = generateIdentity(msg)
  const badgeStr = generateBadge(msg)
  return idStr + badgeStr + nameStr
}

export const generateBullet = (msg: BasicMessage) => {
  const headStr = generateBulletName(msg)
  const tailStr = `：${msg.body.content}`
  return `${headStr}${tailStr}`
}
