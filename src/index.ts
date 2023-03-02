import { startListen } from 'blive-message-listener'
import Cac from 'cac'

// 从package.json中获取版本及名字
import { name, version } from '../package.json'
import { Biliver } from './biliver'
import Listener from './listener'

const cli = Cac(name)

let biliver: Biliver

cli.command('start <roomId>', 'start to get the bullets from specific room').option('-s, --say', 'say every bullet').action((roomId: string, options) => {
  const listener = new Listener(+roomId, startListen)
  biliver = new Biliver({
    roomId,
    isCanSay: options.say,
  },
  listener,
  )
  biliver.start()
})

cli.help()

cli.version(version)

cli.parse()
