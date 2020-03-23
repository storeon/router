let loc = location

/**
 * Change event
 */
let change = Symbol()

/**
 * Changed event
 */
let routerChanged = Symbol()

/**
 * Navigate event
 */
let routerNavigate = Symbol()

/**
 * Router routerKey on store
 */
let routerKey = Symbol('route')

/**
 * Storeon module for URL routing
 * @param {Route[]} routes
 */
function createRouter (routes = []) {
  return store => {
    store.on('@init', () => {
      store.dispatch(change, parse(loc.pathname, routes))
    })

    store.on(routerNavigate, (state, path) => {
      if (state[routerKey].path !== path) {
        history.pushState(null, null, path)
      }

      store.dispatch(change, parse(path, routes))
      store.dispatch(routerChanged, store.get()[routerKey])
    })

    store.on(change, (state, [path, index, params = []]) => {
      let route = routes[index]
      let newState = {}
      newState[routerKey] = {
        match: false,
        path,
        params
      }

      if (route) {
        newState[routerKey].match = route[1](...params)
      }

      return newState
    })

    document.documentElement.addEventListener('click', event => {
      if (
        !event.defaultPrevented &&
        event.target.tagName === 'A' &&
        event.target.href.indexOf(loc.origin) === 0 &&
        event.target.target !== '_blank' &&
        event.target.dataset.ignoreRouter == null &&
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault()
        store.dispatch(
          routerNavigate,
          event.target.href.slice(loc.origin.length)
        )
      }
    })

    window.addEventListener('popstate', () => {
      if (store.get()[routerKey].path !== loc.pathname) {
        store.dispatch(change, parse(loc.pathname, routes))
        store.dispatch(routerChanged, store.get()[routerKey])
      }
    })
  }
}

/**
 * @private
 * @param {string} path
 * @param {Route[]} routes
 * @return {[string, number, string[]]}
 */
function parse (path, routes) {
  let normalized = path.replace(/(^\/|\/$)/g, '')

  for (let [index, [itemPath]] of routes.entries()) {
    if (typeof itemPath === 'string') {
      let checkPath = itemPath.replace(/(^\/|\/$)/g, '')

      if (checkPath === normalized) {
        return [path, index]
      }

      if (checkPath.includes('*')) {
        let prepareRe = checkPath
          .replace(/[\s!#$()+,.:<=?[\\\]^{|}]/g, '\\$&')
          .replace(/\*/g, '([^/]*)')
        let re = RegExp('^' + prepareRe + '$', 'i')
        let match = normalized.match(re)

        if (match) {
          return [path, index, match.slice(1)]
        }
      }
    }

    if (itemPath instanceof RegExp) {
      let matchRE = normalized.match(itemPath)
      if (matchRE) {
        return [path, index, matchRE.slice(1)]
      }
    }
  }

  return [path]
}

module.exports = {
  routerNavigate,
  routerChanged,
  routerKey,
  createRouter
}
