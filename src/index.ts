/* eslint-disable no-console */
import Cac from 'cac'
import chalk from 'chalk'

// 从package.json中获取版本及名字
import { name, version } from '../package.json'

const cli = Cac(name)

cli.command('start <roomid>', 'start to get the bullets from specific room').option('-s, --say', 'say every bullet').action((roomid: string, options) => {
  console.log(chalk.yellow(roomid, options.say))
  console.log(chalk.blue.bold('this is bule line'))
  console.log(chalk.red.underline.redBright('this is red line'))
})

cli.help()

cli.version(version)

cli.parse()
