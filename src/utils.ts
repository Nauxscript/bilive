import readline from 'readline'
import say from 'say'

export const debouce = <T = unknown>(cb: (args: T) => void, time?: number) => {
  let timer: NodeJS.Timeout
  return (args: T) => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      cb(args)
    }, time)
  }
}

export const debouceSpeak = debouce((content: string) => {
  say.speak(content)
})

export const sligleLineConsole = (message: any) => {
  // delele current line
  readline.clearLine(process.stdout, 0)
  // move cursor to line head
  readline.cursorTo(process.stdout, 0, 0)
  // output
  process.stdout.write(message, 'utf-8')
}
