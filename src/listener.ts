import type { MsgHandler, startListen } from 'blive-message-listener'
import type { Biliver } from './biliver'
import { actionMap } from './dictMap'

class Listener {
  constructor(private roomId: number, private messageListener: typeof startListen) {
  }

  get getRoomId() {
    return this.roomId
  }

  startListen(handler: MsgHandler) {
    this.messageListener(this.roomId, handler)
  }
}

export const basicListenerHandler = (biliver: Biliver) => {
  const handler: MsgHandler = {
    onIncomeDanmu: (msg) => {
      biliver.add(msg)
    },
    onIncomeSuperChat: (msg) => {
      biliver.add(msg)
    },
    onUserAction: (msg) => {
      const { action, user } = msg.body
      if (action !== 'unknown')
        biliver.notice(user.uname + actionMap[action as keyof typeof actionMap])
    },
    onGift: (msg) => {
      biliver.noticeGift(msg)
    },
    onRoomInfoChange: (msg) => {
      biliver.view.updateRoomInfo(msg.body)
    },
    onOpen: () => {
      biliver.view.loading(true)
    },
    onStartListen: () => {
      biliver.view.loading(false)
    },
    onClose: () => {
      biliver.view.loading(true, 'up 下播了')
      setTimeout(() => {
        process.exit()
      }, 6000)
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.log(err)
      biliver.view.loading(false, 'connect error')
      setTimeout(() => {
        process.exit()
      }, 6000)
    },
  }
  return handler
}

export default Listener
