var loc = location

/**
 * Change event
 * @type {symbol}
 */
var change = Symbol()

/**
 * Changed event
 * @type {symbol}
 */
var changed = Symbol()

/**
 * Navigate event
 * @type {symbol}
 */
var navigate = Symbol()

/**
 * Router key on store
 * @type {symbol}
 */
var key = Symbol('route')

/**
 * Storeon module for URL routing
 * @param {Path[]} routes
 * @return {storeCallback}
 */
function createRouter (routes) {
  routes = routes || []

  return function (store) {
    store.on('@init', function () {
      store.dispatch(change, parse(loc.pathname, routes))
    })

    store.on(navigate, function (state, path) {
      if (state[key].path !== path) {
        history.pushState(null, null, path)
      }

      store.dispatch(change, parse(path, routes))
      store.dispatch(changed, store.get()[key])
    })

    store.on(change, function (state, data) {
      var path = data[0]
      var route = routes[data[1]]
      var params = data[2] || []

      var newState = {}
      newState[key] = {
        match: false,
        path: path,
        params: params
      }

      if (data.length > 1) {
        if (typeof route[1] === 'function') {
          newState[key].match = route[1].apply(null, params)
        } else {
          newState[key].match = route[1] || true
        }
      }

      return newState
    })

    document.documentElement.addEventListener('click', function (event) {
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

        var path = event.target.href.slice(loc.origin.length)

        store.dispatch(navigate, path)
      }
    })

    window.addEventListener('popstate', function () {
      if (store.get()[key].path !== loc.pathname) {
        store.dispatch(change, parse(loc.pathname, routes))
        store.dispatch(changed, store.get()[key])
      }
    })
  }
}

/**
 * @private
 * @param {string} path
 * @param {Path[]} routes
 * @return {array}
 */
function parse (path, routes) {
  var normalized = path.replace(/(^\/|\/$)/g, '')

  for (var index = 0; index < routes.length; index++) {
    var item = routes[index]

    if (typeof item[0] === 'string') {
      var checkPath = item[0].replace(/(^\/|\/$)/g, '')

      if (checkPath === normalized) {
        return [path, index]
      }

      if (checkPath.indexOf('*') >= 0) {
        var prepareRe = checkPath
          .replace(/[\s!#$()+,.:<=?[\\\]^{|}]/g, '\\$&')
          .replace(/\*/g, '([^/]*)')
        var re = RegExp('^' + prepareRe + '$', 'i')
        var match = normalized.match(re)

        if (match) {
          return [path, index, [].concat(match).slice(1)]
        }
      }
    }

    if (item[0] instanceof RegExp) {
      var matchRE = normalized.match(item[0])
      if (matchRE) {
        return [path, index, [].concat(matchRE).slice(1)]
      }
    }
  }

  return [path]
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
