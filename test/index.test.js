var createStore = require('storeon')

var router = require('../')

/* eslint es5/no-rest-parameters:0, es5/no-arrow-functions:0 */
/* eslint es5/no-shorthand-properties:0 */

var clickOnBody = () => {}
beforeAll(() => {
  jest.spyOn(document.body, 'addEventListener')
    .mockImplementation((event, callback) => {
      if (event === 'click') {
        clickOnBody = callback
      }
    })
})

beforeEach(() => {
  history.pushState(null, null, '/')
})

it('init state', () => {
  var store = createStore([
    router.createRouter()
  ])

  var state = getRouterState(store)
  expect(state.match).toBeFalsy()
  expect(state.path).toBe('/')
  expect(state.params).toEqual([])
})

it('init state for complex path', () => {
  var complexPath = '/complex/path/'
  history.pushState(null, null, complexPath)

  var store = createStore([
    router.createRouter()
  ])

  var state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe(complexPath)
  expect(state.params).toEqual([])
})

it('navigate dispatch action', () => {
  var path = '/test/'

  var store = createStore([
    router.createRouter()
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('match route', () => {
  var path = '/path-route/'
  var pathMatch = { page: 'home-route' }

  var store = createStore([
    router.createRouter([
      [path, () => pathMatch]
    ])
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toEqual(pathMatch)
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('several paths router', () => {
  var pathFirst = '/path-first'
  var pathSecond = '/path-second'
  var pathThird = '/path-third'

  var store = createStore([
    router.createRouter([
      [pathFirst, () => ({ id: 1 })],
      [pathSecond, () => ({ id: 2 })],
      [pathThird, () => ({ id: 3 })]
    ])
  ])

  store.dispatch(router.navigate, pathThird)
  store.dispatch(router.navigate, pathFirst)
  store.dispatch(router.navigate, pathSecond)

  var state = getRouterState(store)

  expect(state.match).toEqual({ id: 2 })
  expect(state.path).toBe(pathSecond)
  expect(state.params).toEqual([])
})

it('check callback params', () => {
  var path = '/blog/post/2019/05/24'
  var pathMatch = { year: '2019', month: '05', day: '24' }

  var store = createStore([
    router.createRouter([
      ['/blog/post/*/*/*', (year, month, day) => ({
        year,
        month,
        day
      })]
    ])
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toEqual(pathMatch)
  expect(state.path).toBe(path)
  expect(state.params).toEqual(['2019', '05', '24'])
})

it('regexp route', function () {
  var path = '/blog/post/2019/05'
  var paramsFirst = (year) => ({ page: 'post', year })
  var paramsSecond = (year, month) => ({ page: 'post', year, month })

  var store = createStore([
    router.createRouter([
      [/^blog\/post\/(\d+)$/, paramsFirst],
      [/^blog\/post\/(\d+)\/(\d+)$/, paramsSecond]
    ])
  ])

  store.dispatch(router.navigate, path)

  var state = getRouterState(store)

  expect(state.match).toEqual({ page: 'post', year: '2019', month: '05' })
  expect(state.path).toBe(path)
  expect(state.params).toEqual(['2019', '05'])
})

it('change browser history', async () => {
  var path = '/history-browser'
  var params = { page: 'history' }

  var store = createStore([
    router.createRouter([
      [path, () => params]
    ])
  ])

  store.dispatch(router.navigate, path)
  store.dispatch(router.navigate, '/')

  history.back()

  await new Promise(resolve => {
    setTimeout(() => {
      var state = getRouterState(store)

      expect(state.match).toEqual(params)
      expect(state.path).toBe(path)
      expect(state.params).toEqual([])

      resolve()
    }, 100)
  })
})

it('double change browser history', async () => {
  var path = '/history-browser'

  var store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  history.pushState(null, null, path)
  history.pushState(null, null, path)
  history.back()

  await new Promise(resolve => {
    setTimeout(() => {
      var state = getRouterState(store)

      expect(state.match).toBeTruthy()
      expect(state.path).toBe(path)
      expect(state.params).toEqual([])

      resolve()
    }, 100)
  })
})

it('click link', () => {
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
    preventDefault: () => {}
  })

  var state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('click div', () => {
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
    preventDefault: () => {}
  })

  var state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe('/')
  expect(state.params).toEqual([])
})

it('check navigate action', () => {
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

it('check navigate action in same path', () => {
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

it('check changed event', async () => {
  var path = '/changed/'
  var params = { page: 'home' }

  var store = createStore([
    router.createRouter([
      [path, () => params]
    ])
  ])

  store.on(router.changed, async () => {
    var state = getRouterState(store)

    expect(state.match).toEqual(params)
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
