import type { Widgets } from 'blessed'
import { box, loading, screen } from 'blessed'
import { LinkText } from './components/linkText'
import type { RoomInfo } from './fetchs'
import type { MyElements } from './viewBasicData'
import { initDataBulletList, initDataHeader, initHeightMap, initRoomMsgList } from './viewBasicData'
import { InteractiveList } from './components/interactiveList'
import { refreshViewElementsSize, throttle } from './utils'
import type { MapProps } from './types'

// 直播间地址前缀
const baseLiveUrl = 'https://live.bilibili.com/'

// for debugging
// const testData = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
export class BiliverView {
  private viewSequence: Widgets.BoxElement [] = []
  private currViewIndex = 0

  calculateHeightMap: Record<MyElements, MapProps> = initHeightMap

  screen = screen({
    smartCSR: true,
    fullUnicode: true,
    title: 'BiLive',
  })

  header = box(initDataHeader)

  roomTitle = new LinkText({
    content: ' - ',
    top: -1,
    left: 2,
    bold: 'bolder',
  })

  // bulletList = list(initDataBulletList)
  bulletList = new InteractiveList(this, Object.assign(initDataBulletList, {
    customOptions: {
      listTitle: ' 弹幕栏 ',
    },
  }))

  roomMsgList = new InteractiveList(this, Object.assign(initRoomMsgList, {
    customOptions: {
      listTitle: ' 直播间消息 ',
    },
  }))

  loadingDialog = loading({
    top: 'center',
    left: 'center',
    width: 10,
    height: 5,
    style: {
      bg: '#ffffff',
    },
  })

  roomInfo: Partial<RoomInfo> & { room_url: string } = {
    room_id: 0,
    room_url: '',
  }

  bulletListData: string[] = []

  constructor(roomId: number) {
    this.roomInfo.room_id = roomId
    this.roomInfo.room_url = baseLiveUrl + roomId
    this.init()
    this.render()
  }

  private bindFocusAndBlurEvent() {
    // this.viewSequence.forEach((ele) => {
    //   ele.on('focus', () => {
    //     const { top } = this.calculateHeightMap[ele.name as MyElements]
    //     top && (ele.top = top)
    //     this.screen.render()
    //   })

    //   ele.on('blur', () => {
    //     const { top } = this.calculateHeightMap[ele.name as MyElements]
    //     ele.top = top
    //     this.screen.render()
    //   })
    // })
  }

  private bindHeaderEvent() {}

  private bindScreenEvent() {
    this.screen.key(['left', 'right'], (ch, key) => {
      let step = 1
      key.name === 'left' && (step = -1)

      if (this.currViewIndex === 0 && step === -1)
        this.focusElementByIndex(this.viewSequence.length - 1)
      else if (this.currViewIndex === this.viewSequence.length - 1 && step === 1)
        this.focusElementByIndex(0)
      else
        this.focusElementByIndex(this.currViewIndex + step)
    })

    // helper dialog
    this.screen.key(['?'], () => {
      this.header.content = '?'
    })

    // Quit on Escape, q, or Control-C. Must be set!
    this.screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0)
    })
  }

  private appendView(ele: Widgets.BoxElement, skip = false) {
    this.screen.append(ele)
    !skip && this.viewSequence.push(ele)
  }

  private focusElementByIndex(index: number) {
    // console.log(index)
    const ele = this.viewSequence[index]
    this.calculateHeightMap = refreshViewElementsSize(ele.name as MyElements, index, this.viewSequence)
    if (ele) {
      ele.focus()
      this.currViewIndex = index
      this.render()
    }
  }

  private initHeader() {
    // this.roomTitle.content = `房间号：${this.roomInfo.room_id}`
    // this.roomTitle.content = this.roomInfo.title || ''
    this.roomTitle.setUrl(this.roomInfo.room_url)
    this.header.append(this.roomTitle.ele)
    this.bindHeaderEvent()
  }

  private refreshHeader() {
    const { title, description, room_id } = this.roomInfo
    this.roomTitle.ele.content = ` ${title} | ${room_id} ` || ''
    this.header.content = description || ''

    this.render()
  }

  init() {
    this.initHeader()

    this.appendView(this.header)
    this.appendView(this.roomMsgList.ele)
    this.appendView(this.bulletList.ele)
    this.appendView(this.loadingDialog, true)

    // focus bulletList first
    this.currViewIndex = 2
    this.focusElementByIndex(this.currViewIndex)

    this.bindFocusAndBlurEvent()
    this.bindScreenEvent()
  }

  render = throttle(() => {
    this.screen.render()
  })

  loading(isLoading: boolean, msg?: string) {
    if (isLoading) {
      this.loadingDialog.content = 'loading' || msg
      this.loadingDialog.load('')
      this.loadingDialog.focus()
      return
    }
    this.loadingDialog.stop()
  }

  updateRoomInfo(info: Partial<RoomInfo>) {
    this.roomInfo = Object.assign(this.roomInfo, info)
    this.refreshHeader()
  }
}
