/* eslint-disable no-console */
import say from 'say'
import type { DanmuMsg, Message, MessageListener, SuperChatMsg } from 'blive-message-listener'
import { type MsgHandler, startListen } from 'blive-message-listener'
import chalk from 'chalk'
import { debouceSpeak, sligleLineConsole } from './utils'

const initHandler = (biliver: Biliver): MsgHandler => {
  return {
    onIncomeDanmu(msg) {
      biliver.add(msg)
    },
    onIncomeSuperChat(msg) {
      biliver.add(msg)
    },
    onOpen() {
      sligleLineConsole('===== open ws =====')
    },
    onStartListen() {
      sligleLineConsole('\r=====  start! =====')
    },
    onClose() {
      console.log('===== this up is close the live =====')
      process.exit()
    },
    onError(err) {
      console.log(err)
      console.log('=====  connect error! =====')
      process.exit()
    },
  }
}

export interface Options {
  roomId: string
  isCanSay?: boolean
  speakAtSameTime?: boolean
}

export class Biliver {
  roomId: string
  // speak the bullet
  isCanSay: boolean

  currBulletContent = ''
  // Make a sound at the same time
  speakAtSameTime = false

  bullets: Map<string, Message<DanmuMsg | SuperChatMsg>> = new Map()

  listener: MessageListener | undefined

  handler: MsgHandler

  constructor(options: Options) {
    this.roomId = options.roomId
    this.isCanSay = options.isCanSay || false
    this.speakAtSameTime = options.speakAtSameTime || false
    this.handler = initHandler(this)
  }

  start() {
    this.listener = startListen(+this.roomId, this.handler)
  }

  add(msg: Message<DanmuMsg | SuperChatMsg>) {
    this.bullets.set(msg.id, msg)
    this.fire(msg)
  }

  fire(msg: Message<DanmuMsg | SuperChatMsg>) {
    console.log(this.createBulletStr(msg))
  }

  say(msg: Message<DanmuMsg | SuperChatMsg>) {
    if (!this.isCanSay)
      return
    if (!this.speakAtSameTime)
      debouceSpeak(msg.body.content)
    else
      say.speak(msg.body.content)
  }

  public setupHandler(handler: MsgHandler) {
    this.handler = Object.assign(this.handler, handler)
  }

  public createBulletStr(msg: Message<DanmuMsg | SuperChatMsg>) {
    const outputStr = `${msg.body.user.uname}：${msg.body.content}`
    return chalk.yellowBright.bold(outputStr)
  }
}
