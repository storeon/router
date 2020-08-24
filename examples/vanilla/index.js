import { createStoreon } from 'storeon'

import { createRouter, routerChanged, routerKey } from '../../'

const store = createStoreon([
  createRouter([
    ['/', () => ({ page: 'home' })],
    ['/blog', () => ({ page: 'blog' })],
    ['/blog/post/*', id => ({ page: 'post', id })],

    [
      /^blog\/post\/(\d+)\/(\d+)$/,
      (year, month) => ({ page: 'post', year, month })
    ]
  ])
])

setData(store.get()[routerKey])

store.on(routerChanged, (_, data) => {
  setData(data)
})

function setData (data) {
  document.querySelector('.data').textContent = JSON.stringify(data)
}
