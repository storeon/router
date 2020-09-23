# Storeon Router

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">

[Storeon] Router solves the problems of routing while seamlessly providing full control.

Its size is 577 bytes (minified and gzipped) and uses [Size Limit] to control size.

[Storeon]: https://github.com/storeon/storeon
[Size Limit]: https://github.com/ai/size-limit


```js
import { createStoreon } from 'storeon'
import { createRouter, routerChanged, routerKey } from '@storeon/router'

const store = createStoreon([
  createRouter([
    ['/', () => ({ page: 'home' })],
    ['/blog', () => ({ page: 'blog' })],
    ['/blog/post/*', (id) => ({ page: 'post', id })],

    [
      /^blog\/post\/(\d+)\/(\d+)$/,
      (year, month) => ({ page: 'post', year, month })
    ]
  ])
])

setData(store.get()[routerKey])

store.on(routerChanged, function (_, data) {
  setData(data)
})

function setData (data) {
  document
    .querySelector('.data')
    .innerText = JSON.stringify(data)
}
```

<a href="https://evrone.com/?utm_source=storeon-router">
    <img src="https://solovev.one/static/evrone-sponsored-300.png" alt="Sponsored by Evrone" width="210">
</a>


## Installation

```
npm install @storeon/router
# or
yarn add @storeon/router
```


## Examples

* [Vanilla](./examples/vanilla/)
* [React/Preact](./examples/react/)
* [Svelte](./examples/svelte/)


## API

```js
import { createRouter } from '@storeon/router'

const moduleRouter = createRouter([
  [path, callback]
])
```

Function `createRouter` could have options:

* __path__: path name can be a string or RegExp.
* __callback__: the callback function must return an object with parameters for this path.

`routerKey` – key for store.

`routerNavigate` – navigation action.

`routerChanged` – change event of pathname.


### Ignore link

Add `data-ignore-router` attribute to the link so that the router ignores it.
