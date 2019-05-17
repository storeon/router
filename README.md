# Storeon Router

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">
     
[Storeon] Router which solves the problem of routing your application, providing full control over the route. 

It size is 605 bytes (minified and gzipped) and uses [Size Limit] to control size.

[Storeon]: https://github.com/storeon/storeon
[Size Limit]: https://github.com/ai/size-limit


## Installation

```
npm install @storeon/router
# or 
yarn add @storeon/router
```


## Usage

If you want to use the router you should import the `router.createRouter` from `@storeon/router` and add this module to `createStore`.

```js
import createStore from 'storeon'
import router from '@storeon/router'

const store = createStore([
  router.createRouter([
    ['/simple-path', () => alert('simple')],
    ['/complex/*/with-params/*', (_, event) => console.log(event.params)],
    [/^regexp-path\/([^/]+)\//, (_, event) => {
      console.log(event.path, event.params, event.match)
    }]
  ])
])

store.on(router.changed, (state, event) => {
  if (!event.match) {
    // route not found
  }
})

store.dispatch(router.navigate, '/')
```


## API

```js
import router from '@storeon/router'

const moduleRouter = router.createRouter([
  [path, callback]
])
```

Function `router.createRouter` could have options:

* __path__: path name can be a string or RegExp.
* __callback__: callback function that is executed when navigating a route. Taking the arguments of state and event with:
  * __match__: is there a match to the initial paths.
  * __path__: current pathname.
  * __params__: parameter array.

`router.key` – key for store.

`router.navigate` – navigation action.

`router.changed` – change event of pathname.


## Sponsor

<p>
  <a href="https://evrone.com/?utm_source=storeon-router">
    <img src="https://solovev.one/static/evrone-sponsored-300.png" 
      alt="Sponsored by Evrone" width="210">
  </a>
</p>


## LICENSE

MIT
