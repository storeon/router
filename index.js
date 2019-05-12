var loc = location

/**
 * Change event
 * @type {symbol}
 */
var change = Symbol('change')

/**
 * Changed event
 * @type {symbol}
 */
var changed = Symbol('changed')

/**
 * Navigate event
 * @type {symbol}
 */
var navigate = Symbol('navigate')

/**
 * Router key on store
 * @type {symbol}
 */
var key = Symbol('router')

/**
 * Storeon module for URL routing
 * @param {Path[]} routes
 * @return {storeCallback}
 */
function createRouter (routes) {
  routes = (routes || [])

  return function (store) {
    store.on('@init', function () {
      store.dispatch(change, parse(loc.pathname, routes))
    })

    store.on(navigate, function (_, path) {
      store.dispatch(change, parse(path, routes))
      store.dispatch(changed, store.get()[key])
    })

    store.on(change, function (state, data) {
      var newState = {}
      newState[key] = { match: false }

      if (data) {
        if (typeof routes[data[0]][1] === 'function') {
          routes[data[0]][1](data[1] || [])
        }

        newState[key] = {
          match: true,
          path: loc.pathname,
          params: data[1] || []
        }
      }

      return newState
    })

    initEventListeners(store)
  }
}

/**
 * @private
 * @param {string} path
 * @param {Path[]} routes
 * @return {boolean|*[]}
 */
function parse (path, routes) {
  var normilized = normalizePath(path)

  for (var index = 0; index < routes.length; index++) {
    var item = routes[index]

    if (typeof item[0] === 'string') {
      var checkPath = normalizePath(item[0])

      if (checkPath === normilized) {
        return [index]
      } else if (checkPath.indexOf('*') >= 0) {
        var re = RegExp('^' + checkPath.replace(/\*/g, '([^/]*)') + '$', 'i')
        var match = normilized.match(re)

        if (match) {
          return [index, [].concat(match).slice(1)]
        }
      }
    }

    if (item[0] instanceof RegExp) {
      var matchRE = normilized.match(item[0])
      if (matchRE) {
        return [index, [].concat(matchRE).slice(1)]
      }
    }
  }

  return false
}

/**
 * @private
 * @param {string} path
 * @return {string}
 */
function normalizePath (path) {
  return path.replace(/\/$/, '').replace(/^\//, '')
}

/**
 * @private
 * @param {Store} store
 */
function initEventListeners (store) {
  document.body.addEventListener('click', function (event) {
    if (
      !event.defaultPrevented &&
      event.target.tagName === 'A' &&
      event.target.href.indexOf(loc.origin) === 0 &&
      event.target.target !== '_blank' &&
      event.button === 0 &&
      event.which === 1 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault()

      var path = event.target.href.slice(loc.origin.length)

      store.dispatch(navigate, path)
      history.pushState(null, null, path)
    }
  })

  window.addEventListener('popstate', function () {
    if (store.get().path !== loc.pathname) {
      store.dispatch(navigate, loc.pathname)
    }
  })
}

module.exports = {
  navigate: navigate,
  changed: changed,
  key: key,
  createRouter: createRouter
}

/**
 * @typedef {array} Path
 * @property {string | RegExp} 0
 * @property {?function} 1
 */

/**
 * @private
 * @callback storeCallback
 * @param {Store} store
 */

/**
 * @private
 * @name Store
 * @class
 * @method get
 * @method dispatch
 * @method on
 */
