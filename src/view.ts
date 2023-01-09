import c from 'child_process'
import type { Widgets } from 'blessed'
import { box, list, loading, screen, text } from 'blessed'
import type { RoomInfo } from './fetchs'

// 直播间地址前缀
const baseLiveUrl = 'https://live.bilibili.com/'

// for debugging
// const testData = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
export class BiliverView {
  private viewSequence: Widgets.BoxElement [] = []
  private currViewIndex = 0

  screen = screen({
    smartCSR: true,
    fullUnicode: true,
    title: 'BiLive',
  })

  header = box({
    top: '0',
    left: 'center',
    width: '100%',
    height: 4,
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      border: {
        fg: '#000000',
      },
      focus: {
        border: {
          fg: 'white',
        },
      },
      hover: {
        bg: 'green',
      },
    },
  })

  roomTitle = text({
    content: '1234',
    top: -1,
    left: 2,
  })

  bulletList = list({
    top: 4,
    left: 'center',
    width: '100%',
    height: '100%-4',
    tags: true,
    border: {
      type: 'line',
    },
    fg: 'red',
    style: {
      border: {
        fg: '#000000',
      },
      focus: {
        border: {
          fg: 'white',
        },
        scrollbar: {
          bg: 'white',
        },
      },
    },
    mouse: true,
    scrollable: true,
    scrollbar: {
      ch: ' ',
    },
    invertSelected: false,
    // interactive: false, // set it to false will diasable the mouse event
    // items: testData, // for testing
  })

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

  private bindEvent() {
    this.screen.key(['left', 'right'], (ch, key) => {
      let step = 1
      key.name === 'left' && (step = -1)

      if (this.currViewIndex === 0)
        this.focusElementByIndex(this.viewSequence.length - 1)
      else if (this.currViewIndex === this.viewSequence.length - 1)
        this.focusElementByIndex(0)
      else
        this.focusElementByIndex(this.currViewIndex + step)
    })

    this.bulletList.key(['up', 'down'], (ch, key) => {
      this.scroll(key.name === 'up' ? 0 : 1)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.bulletList.on('focus', (tt) => {
      // console.log(tt)
      this.bulletList.height = '100%-4'
      this.screen.render()
    })

    // scroll to bottom
    this.bulletList.key(['S-g'], () => {
      this.bulletList.setScrollPerc(100)
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
    const ele = this.viewSequence[index]
    if (ele) {
      ele.focus()
      this.currViewIndex = index
      this.screen.render()
    }
  }

  private scroll(index: 1 | 0) {
    // for debugging
    // this.header.content = `getScroll:${this.bulletList.getScroll()};childBase:${this.bulletList.childBase};length: ${this.bulletListData.length};height:${this.bulletList.height}`
    let to = 0
    if (index)
      to = this.bulletList.childBase + Number(this.bulletList.height) - 2
    else
      to = this.bulletList.childBase - 1

    if (index >= 0 && index <= this.bulletListData.length - 1) {
      this.bulletList.scrollTo(to)
      this.screen.render()
    }
  }

  private getLastVisualElementIndex() {
    this.header.content = `${this.bulletList.childBase + Number(this.bulletList.height) + 1}`
    return this.bulletList.childBase + Number(this.bulletList.height)
  }

  private initHeader() {
    // this.roomTitle.content = `房间号：${this.roomInfo.room_id}`
    // this.roomTitle.content = this.roomInfo.title || ''
    this.header.append(this.roomTitle)
    this.roomTitle.on('click', () => {
      c.exec(`open ${this.roomInfo.room_url}`, (error) => {
        if (error)
          c.exec(`open ${this.roomInfo.room_url}`)
      })
    })
  }

  private refreshHeader() {
    const { title, description } = this.roomInfo
    this.roomTitle.content = ` ${title} ` || ''
    this.header.content = description || ''

    this.screen.render()
  }

  private initBulletList() {
    this.bulletList.append(text({
      content: ' 弹幕栏 ',
      top: -1,
      left: 2,
    }))
  }

  init() {
    this.initHeader()
    this.initBulletList()

    this.appendView(this.header)
    this.appendView(this.bulletList)
    this.appendView(this.loadingDialog, true)

    // focus bulletList first
    this.currViewIndex = 1
    this.bulletList.focus()

    this.bindEvent()
  }

  render() {
    this.screen.render()
  }

  loading(isLoading: boolean, msg?: string) {
    if (isLoading) {
      this.loadingDialog.content = 'loading' || msg
      this.loadingDialog.load('')
      this.loadingDialog.focus()
      return
    }
    this.loadingDialog.stop()
  }

  addListItem(item: string) {
    this.bulletListData.push(item)
    this.bulletList.add(item)
    this.bulletList.scroll(1)
    this.screen.render()
  }

  updateRoomInfo(info: Partial<RoomInfo>) {
    this.roomInfo = Object.assign(this.roomInfo, info)
    this.refreshHeader()
  }
}
