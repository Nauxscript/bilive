/* eslint-disable no-console */
// import fs from 'fs'
import say from 'say'
import type { MessageListener } from 'blive-message-listener'
import { type MsgHandler, startListen } from 'blive-message-listener'
import type { BasicMessage } from './types'
// import chalk from 'chalk'
import { BiliverView } from './view'
import { debouceSpeak, generateBullet } from './utils'
import type { RoomInfo } from './fetchs'
import { getRoomInfo } from './fetchs'

export interface Options {
  roomId: string
  isCanSay?: boolean
  speakAtSameTime?: boolean
}

export class Biliver {
  roomId: number
  // speak the bullet
  isCanSay: boolean

  currBulletContent = ''
  // Make a sound at the same time
  speakAtSameTime = false

  bullets: Map<string, BasicMessage> = new Map()

  listener: MessageListener | undefined

  handler: MsgHandler = {}

  view: BiliverView

  roomInfo: RoomInfo | undefined

  constructor(options: Options) {
    this.roomId = Number(options.roomId)
    this.isCanSay = options.isCanSay || false
    this.speakAtSameTime = options.speakAtSameTime || false
    this.view = new BiliverView(this.roomId)
    this.initHandler()
    this.getRoomInfo()
  }

  async getRoomInfo() {
    const data = await getRoomInfo(this.roomId)
    // for debugging
    // fs.writeFile('test.json', JSON.stringify({ data }, null, 4), () => {
    //   process.exit(0)
    // })
    if (data)
      this.view.updateRoomInfo(data)
  }

  start() {
    this.listener = startListen(+this.roomId, this.handler)
  }

  add(msg: BasicMessage) {
    this.bullets.set(msg.id, msg)
    this.fire(msg)
  }

  fire(msg: BasicMessage) {
    this.view.addListItem(this.createBulletStr(msg))
  }

  say(msg: BasicMessage) {
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
      // onRoomInfoChange: (msg) => {
      //   this.view.updateRoomInfo(msg.body)
      // },
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

  public createBulletStr(msg: BasicMessage): string {
    return generateBullet(msg)
  }
}
