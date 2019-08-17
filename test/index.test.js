let createStore = require('storeon')

let router = require('../')

/* eslint es5/no-rest-parameters:0, es5/no-arrow-functions:0 */
/* eslint es5/no-shorthand-properties:0 */

let clickOnBody = () => {}
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
  let store = createStore([
    router.createRouter()
  ])

  let state = getRouterState(store)
  expect(state.match).toBeFalsy()
  expect(state.path).toBe('/')
  expect(state.params).toEqual([])
})

it('init state for complex path', () => {
  let complexPath = '/complex/path/'
  history.pushState(null, null, complexPath)

  let store = createStore([
    router.createRouter()
  ])

  let state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe(complexPath)
  expect(state.params).toEqual([])
})

it('navigate dispatch action', () => {
  let path = '/test/'

  let store = createStore([
    router.createRouter()
  ])

  store.dispatch(router.navigate, path)

  let state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('match route', () => {
  let path = '/path-route/'
  let pathMatch = { page: 'home-route' }

  let store = createStore([
    router.createRouter([
      [path, () => pathMatch]
    ])
  ])

  store.dispatch(router.navigate, path)

  let state = getRouterState(store)

  expect(state.match).toEqual(pathMatch)
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('several paths router', () => {
  let pathFirst = '/path-first'
  let pathSecond = '/path-second'
  let pathThird = '/path-third'

  let store = createStore([
    router.createRouter([
      [pathFirst, () => ({ id: 1 })],
      [pathSecond, () => ({ id: 2 })],
      [pathThird, () => ({ id: 3 })]
    ])
  ])

  store.dispatch(router.navigate, pathThird)
  store.dispatch(router.navigate, pathFirst)
  store.dispatch(router.navigate, pathSecond)

  let state = getRouterState(store)

  expect(state.match).toEqual({ id: 2 })
  expect(state.path).toBe(pathSecond)
  expect(state.params).toEqual([])
})

it('check callback params', () => {
  let path = '/blog/post/2019/05/24'
  let pathMatch = { year: '2019', month: '05', day: '24' }

  let store = createStore([
    router.createRouter([
      ['/blog/post/*/*/*', (year, month, day) => ({
        year,
        month,
        day
      })]
    ])
  ])

  store.dispatch(router.navigate, path)

  let state = getRouterState(store)

  expect(state.match).toEqual(pathMatch)
  expect(state.path).toBe(path)
  expect(state.params).toEqual(['2019', '05', '24'])
})

it('regexp route', () => {
  let path = '/blog/post/2019/05'
  let paramsFirst = year => ({ page: 'post', year })
  let paramsSecond = (year, month) => ({ page: 'post', year, month })

  let store = createStore([
    router.createRouter([
      [/^blog\/post\/(\d+)$/, paramsFirst],
      [/^blog\/post\/(\d+)\/(\d+)$/, paramsSecond]
    ])
  ])

  store.dispatch(router.navigate, path)

  let state = getRouterState(store)

  expect(state.match).toEqual({ page: 'post', year: '2019', month: '05' })
  expect(state.path).toBe(path)
  expect(state.params).toEqual(['2019', '05'])
})

it('change browser history', async () => {
  let path = '/history-browser'
  let params = { page: 'history' }

  let store = createStore([
    router.createRouter([
      [path, () => params]
    ])
  ])

  store.dispatch(router.navigate, path)
  store.dispatch(router.navigate, '/')

  history.back()

  await new Promise(resolve => {
    setTimeout(() => {
      let state = getRouterState(store)

      expect(state.match).toEqual(params)
      expect(state.path).toBe(path)
      expect(state.params).toEqual([])

      resolve()
    }, 100)
  })
})

it('double change browser history', async () => {
  let path = '/history-browser'

  let store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  history.pushState(null, null, path)
  history.pushState(null, null, path)
  history.back()

  await new Promise(resolve => {
    setTimeout(() => {
      let state = getRouterState(store)

      expect(state.match).toBeTruthy()
      expect(state.path).toBe(path)
      expect(state.params).toEqual([])

      resolve()
    }, 100)
  })
})

it('click link', () => {
  let path = '/link-click'
  let store = createStore([
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

  let state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('click div', () => {
  let path = '/link-click'

  let store = createStore([
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

  let state = getRouterState(store)

  expect(state.match).toBeFalsy()
  expect(state.path).toBe('/')
  expect(state.params).toEqual([])
})

it('check navigate action', () => {
  let path = '/navigation/'

  let store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  store.dispatch(router.navigate, path)

  let state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('check navigate action in same path', () => {
  let path = '/navigation/'
  history.pushState(null, null, path)

  let store = createStore([
    router.createRouter([
      [path]
    ])
  ])

  store.dispatch(router.navigate, path)

  let state = getRouterState(store)

  expect(state.match).toBeTruthy()
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('check changed event', async () => {
  let path = '/changed/'
  let params = { page: 'home' }

  let store = createStore([
    router.createRouter([
      [path, () => params]
    ])
  ])

  store.on(router.changed, async () => {
    let state = getRouterState(store)

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
