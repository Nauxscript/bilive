import readline from 'readline'
import type { DanmuMsg, Message, SuperChatMsg } from 'blive-message-listener'
import say from 'say'
import chalk from 'chalk'
import { circleNumbe, circleNumber } from './dictMap'

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

export const setBadgeStyle = (msg: Message<DanmuMsg | SuperChatMsg>) => {
  if (!msg.body.user.badge)
    return msg
  const { badge } = msg.body.user
  const lv = circleNumber[badge.level] || badge.level
  // 名字颜色
  badge.name = `[${lv}${badge.name}]`

  // 点亮
  badge.active && (badge.name = chalk.bgHex(badge.color).inverse(badge.name))
  return msg
}
