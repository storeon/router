var createStore = require('storeon')

var router = require('../')

/* eslint es5/no-arrow-functions:0, es5/no-destructuring:0 */

function increment (store) {
  store.on('@init', function () {
    return { count: 0 }
  })

  store.on('inc', function (state) {
    return { count: state.count + 1 }
  })
}

var store = createStore([
  increment,
  router.createRouter([
    ['/', function (p) {
      setStatus('home', p)
    }],

    ['/simple/', function (p) {
      return setStatus('simple', p)
    }],

    ['/complex/*/*/', function (p) {
      return setStatus('complex', p)
    }],

    [/^dialogs\/([^/]+)(?:\/([^/]+))$/, function (p) {
      return setStatus('dialogs', p)
    }]
  ])
])

setData(store.get()[router.key])

store.on(router.changed, function (_, data) {
  setData(data)
})

function setStatus (name, params) {
  document
    .querySelector('.status')
    .innerText = ['Last known page', name, JSON.stringify(params)].join(' :: ')
}

function setData (data) {
  document
    .querySelector('.data')
    .innerText = JSON.stringify(data)
}
