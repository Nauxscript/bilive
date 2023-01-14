import type { DanmuMsg, Message, SuperChatMsg } from 'blive-message-listener'

export type BasicMessage = Message<DanmuMsg | SuperChatMsg>

export interface MapProps {
  height: string
  top: string | number
}
