import { list, text } from 'blessed'
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

  constructor(parent: BiliverView, opt?: Widgets.ListOptions<any> & { customOptions?: CustomOptions }) {
    this.ele = list(opt)
    this.parent = parent
    this.customOption = opt?.customOptions
    this.initTitle()
    this.bindBulletListEvent()
  }

  private initTitle() {
    this.customOption?.listTitle && this.ele.append(text({
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
  }

  private scroll(index: 1 | 0) {
    // for debugging
    // this.header.content = `getScroll:${this.ele.getScroll()};childBase:${this.ele.childBase};length: ${this.eleData.length};height:${this.ele.height}`
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
    this.listData.push(item)
    this.ele.add(item)
    this.ele.scroll(1)
    this.parent.render()
  }
}
