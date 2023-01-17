import c from 'child_process'
import type { Widgets } from 'blessed'
import blessed from 'blessed'

export class LinkText {
  ele: Widgets.TextElement
  url = ''
  constructor(opt?: Widgets.TextOptions) {
    this.ele = blessed.text(opt)
  }

  bindEvent() {
    this.ele.on('click', () => {
      c.exec(`open ${this.url}`, (error) => {
        if (error)
          c.exec(`open ${this.url}`)
      })
    })
  }

  setUrl(url: string) {
    this.url = url
    this.bindEvent()
  }
}
