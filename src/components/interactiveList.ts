import blessed from 'blessed'
import type { Widgets } from 'blessed'
import type { BiliverView } from './../view'

interface CustomOptions {
  listTitle?: string
}

export class InteractiveList {
  ele: Widgets.ListElement
  parent: BiliverView
  listData: string[] = []
  customOption: CustomOptions | undefined
  debugMode = false

  constructor(parent: BiliverView, opt?: Widgets.ListOptions<any> & { customOptions?: CustomOptions }) {
    this.ele = blessed.list(opt)
    this.parent = parent
    this.customOption = opt?.customOptions
    this.initTitle()
    this.bindBulletListEvent()
  }

  private initTitle() {
    this.customOption?.listTitle && this.ele.append(blessed.text({
      content: ` ${this.customOption.listTitle} `,
      top: -1,
      left: 2,
    }))

    // this.bindBulletListEvent()
  }

  private bindBulletListEvent() {
    this.ele.key(['up', 'down'], (ch, key) => {
      this.scroll(key.name === 'up' ? 0 : 1)
    })

    // scroll to bottom
    this.ele.key(['S-g'], () => {
      this.ele.setScrollPerc(100)
    })

    // reset scroll height
    this.ele.on('blur', () => {
      this.ele.setScrollPerc(100)
      this.parent.render()
    })

    this.ele.on('focus', () => {
      this.ele.setScrollPerc(100)
      this.parent.render()
    })
  }

  private scroll(index: 1 | 0) {
    let to = 0
    if (index)
      to = this.ele.childBase + Number(this.ele.height) - 2
    else
      to = this.ele.childBase - 1

    if (to >= 0 && to <= this.listData.length - 1) {
      this.ele.scrollTo(to)
      this.parent.render()
    }
  }

  addListItem(item: string) {
    if (this.debugMode)
      return
    this.listData.push(item)
    this.ele.add(item)
    this.ele.scroll(1)
    this.parent.render()
  }

  log(str: any) {
    this.debugMode = true
    this.ele.add(JSON.stringify(str))
    this.ele.scroll(1)
    this.parent.render()
  }
}
