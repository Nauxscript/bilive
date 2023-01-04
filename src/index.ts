/* eslint-disable no-console */
import Cac from 'cac'
import chalk from 'chalk'
import say from 'say'
import { type MsgHandler, startListen } from 'blive-message-listener'

// 从package.json中获取版本及名字
import { name, version } from '../package.json'
import { debouce } from './utils'

const cli = Cac(name)

// current listening room id
let roomId = ''
// speak the bullet
let isCanSay = false

let currBulletContent = ''
// Make a sound at the same time
const speakAtSameTime = false

const debouceSpeak = debouce((content: string) => {
  say.speak(content)
})

const handler: MsgHandler = {
  onIncomeDanmu: (msg) => {
    // console.log(msg.id, msg.body)
    const outputStr = `${msg.body.user.uname}：${msg.body.content}`
    console.log(chalk.yellowBright.bold(outputStr))
    currBulletContent = msg.body.content
    if (!isCanSay)
      return
    if (!speakAtSameTime)
      debouceSpeak(currBulletContent)
    else
      say.speak(msg.body.content)
  },
  onIncomeSuperChat: (msg) => {
    // console.log(msg.id, msg.body)
    const outputStr = `${msg.body.user.uname}：${msg.body.content}`
    console.log(chalk.yellowBright.bold(outputStr))
    currBulletContent = msg.body.content
    if (!isCanSay)
      return
    if (!speakAtSameTime)
      debouceSpeak(currBulletContent)
    else
      say.speak(currBulletContent)
  },
}

cli.command('start <roomid>', 'start to get the bullets from specific room').option('-s, --say', 'say every bullet').action((roomid: string, options) => {
  roomId = roomid
  isCanSay = options.say
  // console.log(chalk.yellow(roomid, options.say))
  // console.log(chalk.blue.bold('this is bule line'))
  console.log(chalk.red.underline.redBright(`bilive started! room id is 【${roomId}】`))
  startListen(+roomId, handler)
})

cli.help()

cli.version(version)

cli.parse()
