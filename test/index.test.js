let { createStoreon } = require('storeon')

let router = require('../')

let clickOnBody = () => {}
beforeAll(() => {
  jest
    .spyOn(document.documentElement, 'addEventListener')
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
  let store = createStoreon([router.createRouter()])

  let state = getRouterState(store)
  expect(state.match).toBe(false)
  expect(state.path).toBe('/')
  expect(state.params).toEqual([])
})

it('init state for complex path', () => {
  let complexPath = '/complex/path/'
  history.pushState(null, null, complexPath)

  let store = createStoreon([router.createRouter()])

  let state = getRouterState(store)

  expect(state.match).toBe(false)
  expect(state.path).toBe(complexPath)
  expect(state.params).toEqual([])
})

it('navigate dispatch action', () => {
  let path = '/test/'

  let store = createStoreon([router.createRouter()])

  store.dispatch(router.routerNavigate, path)

  let state = getRouterState(store)

  expect(state.match).toBe(false)
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('match route', () => {
  let path = '/path-route/'
  let pathMatch = { page: 'home-route' }

  let store = createStoreon([router.createRouter([[path, () => pathMatch]])])

  store.dispatch(router.routerNavigate, path)

  let state = getRouterState(store)

  expect(state.match).toEqual(pathMatch)
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('several paths router', () => {
  let pathFirst = '/path-first'
  let pathSecond = '/path-second'
  let pathThird = '/path-third'

  let store = createStoreon([
    router.createRouter([
      [pathFirst, () => ({ id: 1 })],
      [pathSecond, () => ({ id: 2 })],
      [pathThird, () => ({ id: 3 })]
    ])
  ])

  store.dispatch(router.routerNavigate, pathThird)
  store.dispatch(router.routerNavigate, pathFirst)
  store.dispatch(router.routerNavigate, pathSecond)

  let state = getRouterState(store)

  expect(state.match).toEqual({ id: 2 })
  expect(state.path).toBe(pathSecond)
  expect(state.params).toEqual([])
})

it('check callback params', () => {
  let path = '/blog/post/2019/05/24'
  let pathMatch = { year: '2019', month: '05', day: '24' }

  let store = createStoreon([
    router.createRouter([
      [
        '/blog/post/*/*/*',
        (year, month, day) => ({
          year,
          month,
          day
        })
      ]
    ])
  ])

  store.dispatch(router.routerNavigate, path)

  let state = getRouterState(store)

  expect(state.match).toEqual(pathMatch)
  expect(state.path).toBe(path)
  expect(state.params).toEqual(['2019', '05', '24'])
})

it('regexp route', () => {
  let path = '/blog/post/2019/05'
  let paramsFirst = year => ({ page: 'post', year })
  let paramsSecond = (year, month) => ({ page: 'post', year, month })

  let store = createStoreon([
    router.createRouter([
      [/^blog\/post\/(\d+)$/, paramsFirst],
      [/^blog\/post\/(\d+)\/(\d+)$/, paramsSecond]
    ])
  ])

  store.dispatch(router.routerNavigate, path)

  let state = getRouterState(store)

  expect(state.match).toEqual({ page: 'post', year: '2019', month: '05' })
  expect(state.path).toBe(path)
  expect(state.params).toEqual(['2019', '05'])
})

it('change browser history', async () => {
  let path = '/history-browser'
  let params = { page: 'history' }

  let store = createStoreon([router.createRouter([[path, () => params]])])

  store.dispatch(router.routerNavigate, path)
  store.dispatch(router.routerNavigate, '/')

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

  let store = createStoreon([router.createRouter([[path, () => true]])])

  history.pushState(null, null, path)
  history.pushState(null, null, path)
  history.back()

  await new Promise(resolve => {
    setTimeout(() => {
      let state = getRouterState(store)

      expect(state.match).toBe(true)
      expect(state.path).toBe(path)
      expect(state.params).toEqual([])

      resolve()
    }, 100)
  })
})

it('click link', () => {
  let path = '/link-click'
  let store = createStoreon([router.createRouter([[path, () => true]])])

  clickOnBody({
    target: {
      closest: () => ({
        href: ['http://localhost', path].join(''),
        dataset: {}
      })
    },
    button: 0,
    which: 1,
    preventDefault: () => {}
  })

  let state = getRouterState(store)

  expect(state.match).toBe(true)
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('click ignore link', () => {
  let path = '/link-click'
  let store = createStoreon([router.createRouter([[path, () => true]])])

  clickOnBody({
    target: {
      closest: () => ({
        href: ['http://localhost', path].join(''),
        dataset: {
          ignoreRouter: ''
        }
      })
    },
    button: 0,
    which: 1,
    preventDefault: () => {}
  })

  let state = getRouterState(store)

  expect(state.match).toBe(false)
  expect(state.path).toBe('/')
  expect(state.params).toEqual([])
})

it('click div', () => {
  let path = '/link-click'

  let store = createStoreon([router.createRouter([[path, () => true]])])

  clickOnBody({
    target: {
      closest: () => null
    },
    button: 0,
    which: 1,
    preventDefault: () => {}
  })

  let state = getRouterState(store)

  expect(state.match).toBe(false)
  expect(state.path).toBe('/')
  expect(state.params).toEqual([])
})

it('check navigate action', () => {
  let path = '/navigation/'

  let store = createStoreon([router.createRouter([[path, () => true]])])

  store.dispatch(router.routerNavigate, path)

  let state = getRouterState(store)

  expect(state.match).toBe(true)
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('check navigate action in same path', () => {
  let path = '/navigation/'
  history.pushState(null, null, path)

  let store = createStoreon([router.createRouter([[path, () => true]])])

  store.dispatch(router.routerNavigate, path)

  let state = getRouterState(store)

  expect(state.match).toBe(true)
  expect(state.path).toBe(path)
  expect(state.params).toEqual([])
})

it('check changed event', async () => {
  let path = '/changed/'
  let params = { page: 'home' }

  let store = createStoreon([router.createRouter([[path, () => params]])])

  store.on(router.routerChanged, async () => {
    let state = getRouterState(store)

    expect(state.match).toEqual(params)
    expect(state.path).toBe(path)
    expect(state.params).toEqual([])

    return Promise.resolve()
  })

  store.dispatch(router.routerNavigate, path)
})

/**
 * Get router state
 * @param store
 * @return {{ match: boolean, path: string, params: Array }}
 */
function getRouterState (store) {
  return store.get()[router.routerKey]
}
