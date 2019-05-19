var createStore = require('storeon')

var router = require('../')

/* eslint es5/no-rest-parameters:0, es5/no-arrow-functions:0 */
/* eslint es5/no-shorthand-properties:0 */

var store = createStore([
  router.createRouter([
    ['/', () => ({ page: 'home' })],
    ['/blog', () => ({ page: 'blog' })],
    ['/blog/post/*', (id) => ({ page: 'post', id })],

    [
      /^blog\/post\/(\d+)\/(\d+)$/,
      (year, month) => ({ page: 'post', year, month })
    ]
  ])
])

setData(store.get()[router.key])

store.on(router.changed, function (_, data) {
  setData(data)
})

function setData (data) {
  document
    .querySelector('.data')
    .innerText = JSON.stringify(data)
}
