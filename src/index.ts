#!/usr/bin/env esno
import Cac from 'cac'

// 从package.json中获取版本及名字
import { name, version } from '../package.json'
import { Biliver } from './biliver'

const cli = Cac(name)

let biliver: Biliver

cli.command('start <roomId>', 'start to get the bullets from specific room').option('-s, --say', 'say every bullet').action((roomId: string, options) => {
  biliver = new Biliver({
    roomId,
    isCanSay: options.say,
  })
  biliver.start()
})

cli.help()

cli.version(version)

cli.parse()
