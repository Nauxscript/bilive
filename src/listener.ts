import type { MsgHandler, startListen } from 'blive-message-listener'

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

export default Listener
