import readline from 'readline'
import type { GiftMsg, Message, SuperChatMsg } from 'blive-message-listener'
import say from 'say'
import chalk from 'chalk'
import type { Widgets } from 'blessed'
import { circleNumber, guardLevelSignMap } from './dictMap'
import type { BasicMessage, MapProps } from './types'
import type { MyElements } from './viewBasicData'
import { heightMap, initHeightMap } from './viewBasicData'

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

export const generateUserName = (msg: BasicMessage | Message<GiftMsg>) => {
  const { uname, badge } = msg.body.user
  const unameStr = `@${uname}`
  return badge ? chalk.bgHex(badge.color).inverse(unameStr) : unameStr
}

export const generateIdentity = (msg: BasicMessage | Message<GiftMsg>) => {
  if (!msg.body.user.identity)
    return ''
  let idStr = ''
  let guardLevelStr = ''
  const { rank, guard_level, room_admin } = msg.body.user.identity
  rank && (idStr += `${circleNumber[rank - 1]} `)
  guard_level && (guardLevelStr = chalk.bgHex(msg.body.user.badge?.color || '')(guardLevelSignMap[guard_level]))
  room_admin && (idStr = `${idStr}${chalk.bgHex('#FFD700')('房')}${guardLevelStr}`)
  return idStr ? `${idStr}·` : ''
}

export const generateGiftUserName = (msg: Message<GiftMsg>) => {
  const nameStr = generateUserName(msg)
  const identityStr = generateIdentity(msg)
  return identityStr + nameStr
}

export const generateSuperBullet = (msg: BasicMessage, rawContent: string) => {
  if (!msg.isSuper)
    return rawContent
  const { content_color, price } = msg.body as SuperChatMsg
  return chalk.underline.hex(content_color)(`<￥${price}>${rawContent}`)
}

export const generateBadge = (msg: BasicMessage) => {
  if (!msg.body.user.badge)
    return ''
  let badgeStr = ''
  const { badge } = msg.body.user
  // 名字颜色
  badgeStr = `${badge.name}[${badge.level}]`

  // 点亮
  badge.active && (badgeStr = `${chalk.bgHex(badge.color)(badgeStr)}`)
  return badgeStr
}

export const generateBulletName = (msg: BasicMessage) => {
  const nameStr = generateUserName(msg)
  const idStr = generateIdentity(msg)
  const badgeStr = generateBadge(msg)
  return idStr + badgeStr + nameStr
}

export const generateBullet = (msg: BasicMessage) => {
  const headStr = generateBulletName(msg)
  const tailStr = `：${msg.body.content}`
  let bulletStr = `${headStr}${tailStr}`
  msg.isSuper && (bulletStr = generateSuperBullet(msg, bulletStr))
  return bulletStr
}

export const generateGift = (msg: Message<GiftMsg>) => {
  const { gift_name, coin_type, amount, send_master, combo } = msg.body
  let res = ''
  let conjunction = '投喂了'
  send_master && (conjunction = `向${send_master.uname}${conjunction}`)
  res = `${generateGiftUserName(msg)}${conjunction}[${gift_name}]`
  amount > 1 && (res += ` ×${amount}`)
  // todo
  combo && (res += '[combo]')
  coin_type === 'gold' && (chalk.bgHex('#FFD700')(res))
  return res
}

export const refreshViewElementsSize = (currName: MyElements, currIndex: number, viewSequence: Widgets.BoxElement[]) => {
  let top = 0
  const res: Record<MyElements, MapProps> = initHeightMap
  viewSequence.forEach((ele, index) => {
    const _eleH = heightMap[ele.name as MyElements]
    ele.height = index === currIndex ? _eleH.focus : _eleH.blur
  })

  viewSequence.forEach((ele, index) => {
    const _eleH = heightMap[ele.name as MyElements]
    res[ele.name as MyElements] = {
      top,
      height: index === currIndex ? _eleH.focus : _eleH.blur,
    }
    ele.top = top
    top += Number(ele.height)
  })

  return res
}

export const throttle = (fn: Function, time = 300) => {
  let timer: NodeJS.Timeout | undefined

  return (...args: unknown[]) => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, time)
  }
}
