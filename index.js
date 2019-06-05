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
    store.on(navigate, function (state, path) {
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
  }
}

/**
 * @private
 * @param {string} path
 * @param {Path[]} routes
 * @return {array}
 */
function parse (path, routes) {
  var normilized = path.replace(/(^\/|\/$)/g, '')

  for (var index = 0; index < routes.length; index++) {
    var item = routes[index]

    if (typeof item[0] === 'string') {
      var checkPath = item[0].replace(/(^\/|\/$)/g, '')

      if (checkPath === normilized) {
        return [path, index]
      }

      if (checkPath.indexOf('*') >= 0) {
        var prepareRe = checkPath
          .replace(/[[\]{}()+!<=:?.\\^$|#\s,]/g, '\\$&')
          .replace(/\*/g, '([^/]*)')
        var re = RegExp('^' + prepareRe + '$', 'i')
        var match = normilized.match(re)

        if (match) {
          return [path, index, [].concat(match).slice(1)]
        }
      }
    }

    if (item[0] instanceof RegExp) {
      var matchRE = normilized.match(item[0])
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
