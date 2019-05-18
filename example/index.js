var createStore = require('storeon')

var router = require('../')

/* eslint es5/no-rest-parameters:0 */

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
    ['/', function () {
      setStatus('home', [])
    }],

    ['/simple/', function () {
      return setStatus('simple', [])
    }],

    ['/complex/*/*/', function (...params) {
      return setStatus('complex', params)
    }],

    [/^dialogs\/([^/]+)(?:\/([^/]+))$/, function (...params) {
      return setStatus('dialogs', params)
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
