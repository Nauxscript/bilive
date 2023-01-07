/* eslint-disable no-console */
import say from 'say'
import type { DanmuMsg, Message, MessageListener, SuperChatMsg } from 'blive-message-listener'
import { type MsgHandler, startListen } from 'blive-message-listener'
import chalk from 'chalk'
import { BiliverView } from './view'
import { debouceSpeak } from './utils'

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

  handler: MsgHandler = {}

  view: BiliverView

  constructor(options: Options) {
    this.roomId = options.roomId
    this.isCanSay = options.isCanSay || false
    this.speakAtSameTime = options.speakAtSameTime || false
    this.view = new BiliverView()
    this.initHandler()
  }

  start() {
    this.listener = startListen(+this.roomId, this.handler)
  }

  add(msg: Message<DanmuMsg | SuperChatMsg>) {
    this.bullets.set(msg.id, msg)
    this.fire(msg)
  }

  fire(msg: Message<DanmuMsg | SuperChatMsg>) {
    this.view.addListItem(this.createBulletStr(msg))
  }

  say(msg: Message<DanmuMsg | SuperChatMsg>) {
    if (!this.isCanSay)
      return
    if (!this.speakAtSameTime)
      debouceSpeak(msg.body.content)
    else
      say.speak(msg.body.content)
  }

  initHandler(handler?: MsgHandler) {
    const defaultHandler: MsgHandler = {
      onIncomeDanmu: (msg) => {
        this.add(msg)
      },
      onIncomeSuperChat: (msg) => {
        this.add(msg)
      },
      onOpen: () => {
        this.view.loading(true)
      },
      onStartListen: () => {
        this.view.loading(false)
      },
      onClose: () => {
        this.view.loading(true, 'up 下播了')
        setTimeout(() => {
          process.exit()
        }, 6000)
      },
      onError: (err) => {
        console.log(err)
        this.view.loading(false, 'connect error')
        setTimeout(() => {
          process.exit()
        }, 6000)
      },
    }
    this.handler = Object.assign(defaultHandler, handler || {})
  }

  public createBulletStr(msg: Message<DanmuMsg | SuperChatMsg>) {
    const outputStr = `${msg.body.user.uname}：${msg.body.content}`
    return chalk.yellowBright.bold(outputStr)
  }
}
