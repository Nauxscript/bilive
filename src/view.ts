import type { Widgets } from 'blessed'
import { box, list, loading, screen } from 'blessed'

const testData = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const aa = ['1', '2', '3']
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
    height: '20%',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      focus: {
        border: {
          fg: 'blue',
        },
      },
      hover: {
        bg: 'green',
      },
    },
  })

  bulletList = list({
    top: '20%',
    left: 'center',
    width: '100%',
    height: '80%',
    tags: true,
    border: {
      type: 'line',
    },
    style: {
      focus: {
        border: {
          fg: 'blue',
        },
      },
    },
    mouse: true,
    scrollable: true,
    items: aa, // for testing
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

  bulletListData: string[] = []

  constructor() {
    this.init()
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

    this.screen.key(['up', 'down'], (ch, key) => {
      this.scroll(key.name === 'up' ? 0 : 1)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private scroll(index: 1 | 0) {
    const tt = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    // const length = testData.length
    this.header.content = tt.toString()
    // eslint-disable-next-line no-console
    console.log(aa)
    // this.header.content = `getScroll:${this.bulletList.getScroll()};childBase:${this.bulletList.childBase};length: ${length};`
    // if (index) {
    //   const index = this.getLastVisualElementIndex()
    //   if (index === this.bulletListData.length - 1) {
    //     return this.bulletList.scrollTo(100%)
    //   }
    //   return this.bulletList.scrollTo(index + 1)
    // }

    // this.header.content = `${this.bulletList.childBase - 1}`
    // this.bulletList.scrollTo(this.bulletList.childBase - 1)
    this.screen.render()
  }

  private getLastVisualElementIndex() {
    this.header.content = `${this.bulletList.childBase + Number(this.bulletList.height) + 1}`
    return this.bulletList.childBase + Number(this.bulletList.height)
  }

  init() {
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
}
