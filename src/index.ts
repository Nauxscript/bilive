import Cac from 'cac'

// 从package.json中获取版本及名字
import { name, version } from '../package.json'

const cli = Cac(name)

cli.command('start <roomid>', 'start to get the bullets from specific room').option('-s, --say', 'say every bullet').action((roomid: string, options) => {
  // eslint-disable-next-line no-console
  console.log(roomid, options)
})

cli.help()

cli.version(version)

cli.parse()
