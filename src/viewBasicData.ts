import type { Widgets } from 'blessed'

export enum MyElements {
  HEADER = 'HEADER',
  BULLET_LIST = 'BULLET_LIST',
  ROOM_MSG_LIST = 'ROOM_MSG_LIST',
}

export const initDataHeader: Widgets.BoxOptions = {
  name: MyElements.HEADER,
  top: '0',
  left: 'center',
  width: '100%',
  height: 4,
  border: {
    type: 'line',
  },
  style: {
    fg: 'white',
    border: {
      fg: '#000000',
    },
    focus: {
      border: {
        fg: 'white',
      },
    },
  },
}

export const initRoomMsgList: Widgets.ListOptions<Widgets.ListElementStyle> = {
  name: MyElements.ROOM_MSG_LIST,
  top: 4,
  left: 'center',
  width: '100%',
  height: 10,
  tags: true,
  border: {
    type: 'line',
  },
  fg: 'red',
  style: {
    border: {
      fg: '#000000',
    },
    focus: {
      border: {
        fg: 'white',
      },
    },
  },
  mouse: true,
  scrollable: true,
  scrollbar: {
    ch: ' ',
  },
  invertSelected: false,
  // interactive: false, // set it to false will diasable the mouse event
  // items: testData, // for testing
}

export const initDataBulletList: Widgets.ListOptions<Widgets.ListElementStyle> = {
  name: MyElements.BULLET_LIST,
  top: 14,
  left: 'center',
  width: '100%',
  height: '100%-14',
  tags: true,
  border: {
    type: 'line',
  },
  fg: 'red',
  style: {
    border: {
      fg: '#000000',
    },
    focus: {
      border: {
        fg: 'white',
      },
    },
  },
  mouse: true,
  scrollable: true,
  scrollbar: {
    ch: ' ',
  },
  invertSelected: false,
  // interactive: false, // set it to false will diasable the mouse event
  // items: testData, // for testing
}

export const initHeightMap = {
  HEADER: {
    height: '4',
    top: '0',
  },
  ROOM_MSG_LIST: {
    height: '10',
    top: '4',
  },
  BULLET_LIST: {
    height: '100%-14',
    top: '14',
  },
}

export const _heightMap = {
  HEADER: {
    focus: {
      height: '50% - 10',
    },
    blur: {
      height: '4',
    },
  },
  ROOM_MSG_LIST: {
    focus: {
      height: '50%-4',
    },
    blur: {
      height: '10',
    },
  },
  BULLET_LIST: {
    focus: {
      height: '100%-14',
    },
    blur: {
      height: '50%',
    },
  },
}

export const heightMap: Record<MyElements, { focus: string; blur: string }> = {
  HEADER: {
    focus: '50%-10',
    blur: '4',
  },
  ROOM_MSG_LIST: {
    focus: '50%-4',
    blur: '10',
  },
  BULLET_LIST: {
    focus: '100%-14',
    blur: '50%',
  },
}
