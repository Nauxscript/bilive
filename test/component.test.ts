import path from 'path'
import blessed from 'blessed'
import { InteractiveList } from '../src/components/interactiveList'

const container = blessed.screen({
  dump: `${path.resolve()}/logs/interactiveList.log`,
  smartCSR: true,
  warnings: true,
})

const interactiveList = new InteractiveList(blessed.list(), container,
  'testing title',
)

container.append(interactiveList.ele)

container.key('q', () => {
  return container.destroy()
})

interactiveList.ele.focus()

container.render()
