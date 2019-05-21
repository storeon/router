# Storeon Router

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">
     
[Storeon] Router which solves the problem of routing your application, providing full control over the route. 

It size is 635 bytes (minified and gzipped) and uses [Size Limit] to control size.

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
    ['/', () => ({ page: 'home' })],
    ['/blog', () => ({ page: 'blog' })],
    ['/blog/post/*', (id) => ({ page: 'post', id })],
    [
      /^blog\/post\/(\d+)\/(\d+)$/,
      (year, month) => ({ page: 'post', year, month })
    ]
  ])
])

store.on(router.changed, (state, event) => {
  if (!event.match) {
    show404()
    return
  }

  switch (event.match.page) {
    case 'blog':
      showBlog()
      break
      
    case 'post':
      showPost({
        id: event.match.id,
        year: event.match.year,
        month: event.match.month
      })
      break
      
    default:
      showHome()
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
* __callback__: the callback function must return an object with parameters for this path.

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
