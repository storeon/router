/* eslint-disable es5/no-modules,no-unused-vars,es5/no-arrow-functions */
/* eslint-disable es5/no-block-scoping,es5/no-shorthand-properties */
/* eslint-disable es5/no-computed-properties,es5/no-destructuring */

import React from 'react'
import createStore from 'storeon'
import useStoreon from 'storeon/react'
import StoreContext from 'storeon/react/context'

import router from '../'
import { Home, Blog, Post, NotFound } from './components'

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

function Router () {
  const { [router.key]: route } = useStoreon(router.key)

  switch (route.match.page) {
    case 'home':
      return <Home/>

    case 'blog':
      return <Blog/>

    case 'post':
      return <Post year={route.match.year}
        month={route.match.month} id={route.match.id} />

    default:
      return <NotFound/>
  }
}

export default function App () {
  return (
    <StoreContext.Provider value={store}>
      <ul>
        <li><a href='/'>Home</a></li>
        <li><a href='/blog/'>Blog</a></li>
        <li><a href='/blog/post/hello'>Post hello</a></li>
        <li><a href='/blog/post/2019/05'>Post data</a></li>
        <li><a href='/404'>404</a></li>
      </ul>

      <Router/>
    </StoreContext.Provider>
  )
}
