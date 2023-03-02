import { startListen } from 'blive-message-listener'
import { describe, expect, test, vi } from 'vitest'
import Listener from '../src/listener'

const mockObj = {
  startListen,
}

describe('listener', () => {
  test('basic listener', () => {
    const startListenSpy = vi.spyOn(mockObj, 'startListen')
    const listener = new Listener(123456, mockObj.startListen)
    listener.startListen({})
    expect(startListenSpy).toBeCalledTimes(1)
    expect(listener.getRoomId).toBe(123456)
  })
})
