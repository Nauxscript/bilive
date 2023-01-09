import type { Widgets } from 'blessed'

export enum MyElements {
  HEADER = 'HEADER',
  BULLET_LIST = 'BULLET_LIST',
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
    hover: {
      bg: 'green',
    },
  },
}

export const initDataBulletList: Widgets.ListOptions = {
  name: MyElements.BULLET_LIST,
  top: 4,
  left: 'center',
  width: '100%',
  height: '100%-4',
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
      scrollbar: {
        bg: 'white',
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

