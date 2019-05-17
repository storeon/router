var createStore = require('storeon')

var router = require('../')

var clickOnBody = function () {}
beforeAll(function () {
  jest.spyOn(document.body, 'addEventListener')
    .mockImplementation(function (event, callback) {
      if (event === 'click') {
        clickOnBody = callback
      }
    })
})

beforeEach(function () {
  history.pushState(null, null, '/')
})

it('init state', function () {
  var store = createStore([
    router.createRouter()
  ])

  var state = getRouterState(store)
  expect(state.match).toBeFalsy()
  expect(state.path).toBe('/')
  expect(state.params).toBeUndefined()
})

it('init state for complex path', function () {
  var complexPath = '/complex/path/'
  history.pushState(null, null, complexPath)

  var store = createStore([
    router.createRouter()
  ])

  var state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe(complexPath)
  expect(state.params).toBeUndefined()
})

it('navigate dispatch action', function () {
  var path = '/test/'

  var store = createStore([
    router.createRouter()
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe(path)
  expect(state.params).toBeUndefined()
})

it('match route', function () {
  var path = '/path-route/'

  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('several paths router', function () {
  var pathFirst = '/path-first'
  var pathSecond = '/path-second'
  var pathThird = '/path-third'
  var testCallbackID = 0

  var store = createStore([
    router.createRouter([
      [pathFirst, function () {
        testCallbackID = 1
      }],
      [pathSecond, function () {
        testCallbackID = 2
      }],
      [pathThird, function () {
        testCallbackID = 3
      }]
    ])
  ])

  store.dispatch(router.navigate, pathThird)
  store.dispatch(router.navigate, pathFirst)
  store.dispatch(router.navigate, pathSecond)

  var state = getRouterState(store)

  expect(testCallbackID).toBe(2)
  expect(state.match).toBeTruthy()
  expect(state.path).toBe(pathSecond)
  expect(state.params).toEqual([])
})

it('match complex route', function () {
  var path = '/a/b/c/d/e/f'
  var params = ['b', 'c', 'f']

  var store = createStore([
    router.createRouter([
      ['/a/*/*/d/e/*']
    ])
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual(params)
})

it('regexp route', function () {
  var path = '/dialogs/page/step'

  var store = createStore([
    router.createRouter([
      [/^dialogs\/([^/]+)\/([^/]+)(?:\/([^/]+))$/],
      [/^dialogs\/([^/]+)(?:\/([^/]+))$/]
    ])
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual(['page', 'step'])
})

it('change browser history', async function () {
  var path = '/history-browser'

  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  store.dispatch(router.navigate, path)
  store.dispatch(router.navigate, '/')

  history.back()

  await new Promise(function (resolve) {
    setTimeout(function () {
      var state = getRouterState(store)

      expect(state.match).toBeTruthy()
      expect(state.path).toBe(path)
      expect(state.params).toEqual([])

      resolve()
    }, 100)
  })
})

it('double change browser history', async function () {
  var path = '/history-browser'

  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  history.pushState(null, null, path)
  history.pushState(null, null, path)
  history.back()

  await new Promise(function (resolve) {
    setTimeout(function () {
      var state = getRouterState(store)

      expect(state.match).toBeTruthy()
      expect(state.path).toBe(path)
      expect(state.params).toEqual([])

      resolve()
    }, 100)
  })
})

it('click link', function () {
  var path = '/link-click'
  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  clickOnBody({
    target: {
      tagName: 'A',
      href: ['http://localhost', path].join('')
    },
    button: 0,
    which: 1,
    preventDefault: function () {}
  })

  var state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('click div', function () {
  var path = '/link-click'

  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  clickOnBody({
    target: {
      tagName: 'DIV',
      href: ['http://localhost', path].join('')
    },
    button: 0,
    which: 1,
    preventDefault: function () {}
  })

  var state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe('/')
  expect(state.params).toBeUndefined()
})

it('check navigate action', function () {
  var path = '/navigation/'

  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('check navigate action in same path', function () {
  var path = '/navigation/'
  history.pushState(null, null, path)

  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('check changed event', async function () {
  var path = '/changed/'

  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  store.on(router.changed, await function () {
    var state = getRouterState(store)

    expect(state.match).toBeTruthy()
    expect(state.path).toBe(path)
    expect(state.params).toEqual([])

    return Promise.resolve()
  })

  store.dispatch(router.navigate, path)
})

/**
 * Get router state
 * @param store
 * @return {{ match: boolean, path: string, params: Array }}
 */
function getRouterState (store) {
  return store.get()[router.key]
}
