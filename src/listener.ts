import type { MsgHandler, startListen } from 'blive-message-listener'

class Listener {
  constructor(private messageListener: typeof startListen) {
  }

  startListen(roomId: number, handler: MsgHandler) {
    this.messageListener(roomId, handler)
  }
}

export default Listener
