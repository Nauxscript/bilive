import say from 'say'
import type { GiftMsg, Message } from 'blive-message-listener'
import { type MsgHandler } from 'blive-message-listener'
import type { BasicMessage } from './types'
import { BiliverView } from './view'
import { debouceSpeak, generateBullet, generateGift } from './utils'
import type { RoomInfo } from './fetchs'
import { getRoomInfo } from './fetchs'
import { actionMap } from './dictMap'
import type Listener from './listener'

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

  handler: MsgHandler = {}

  view: BiliverView

  roomInfo: RoomInfo | undefined

  constructor(options: Options, private listener: Listener) {
    this.roomId = Number(options.roomId)
    this.isCanSay = options.isCanSay || false
    this.speakAtSameTime = options.speakAtSameTime || false
    this.listener = listener
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
    this.listener.startListen(+this.roomId, this.handler)
  }

  add(msg: BasicMessage) {
    this.bullets.set(msg.id, msg)
    this.fire(msg)
  }

  notice(msg: string) {
    this.view.roomMsgList.addListItem(msg)
  }

  fire(msg: BasicMessage) {
    this.view.bulletList.addListItem(this.createBulletStr(msg))
  }

  say(msg: BasicMessage) {
    if (!this.isCanSay)
      return
    if (!this.speakAtSameTime)
      debouceSpeak(msg.body.content)
    else
      say.speak(msg.body.content)
  }

  noticeGift(msg: Message<GiftMsg>) {
    this.notice(this.createGiftStr(msg))
  }

  initHandler(handler?: MsgHandler) {
    const defaultHandler: MsgHandler = {
      onIncomeDanmu: (msg) => {
        this.add(msg)
      },
      onIncomeSuperChat: (msg) => {
        this.add(msg)
      },
      onUserAction: (msg) => {
        const { action, user } = msg.body
        if (action !== 'unknown')
          this.notice(user.uname + actionMap[action])
      },
      onGift: (msg) => {
        this.noticeGift(msg)
      },
      onRoomInfoChange: (msg) => {
        this.view.updateRoomInfo(msg.body)
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
        // eslint-disable-next-line no-console
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

  public createGiftStr(msg: Message<GiftMsg>): string {
    return generateGift(msg)
  }
}
