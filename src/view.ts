import c from 'child_process'
import type { Widgets } from 'blessed'
import { box, list, loading, screen, text } from 'blessed'
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
    top: 4,
    left: 'center',
    width: '100%',
    height: '100%-4',
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

  bulletListData: string[] = []

  constructor() {
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

  init() {
    const title = text({
      content: '1234',
    })
    title.on('click', () => {
      c.exec('open https://live.bilibili.com/', (error) => {
        if (error)
          c.exec('start http://www.baidu.comm')
      })
    })
    this.header.append(title)
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
