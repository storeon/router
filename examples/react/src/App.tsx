import React from 'react'
import {createStoreon, StoreonStore} from 'storeon'
import { useStoreon, StoreContext } from 'storeon/react'

import {createRouter, routerKey, RouterState} from '../../../'
import { Home, Blog, Post, NotFound } from './components'

type Route = {
  page: string
  [key: string]: string
}

const store = createStoreon([
  createRouter<Route>([
    ['/', () => ({ page: 'home' })],
    ['/blog', () => ({ page: 'blog' })],
    ['/blog/post/*', id => ({ page: 'post', id })],
    [
      /^blog\/post\/(\d+)\/(\d+)$/,
      (year, month) => ({ page: 'post', year, month })
    ]
  ])
])

function Router () {
  let { [routerKey]: route } = useStoreon<RouterState<Route>>(routerKey)

  if (route.match === false) {
    return <NotFound />
  }

  switch (route.match.page) {
    case 'home':
      return <Home />

    case 'blog':
      return <Blog />

    case 'post':
      return (
        <Post
          year={route.match.year}
          month={route.match.month}
          id={route.match.id}
        />
      )

    default:
      return <NotFound />
  }
}

export default function App () {
  return (
    <StoreContext.Provider value={store}>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/blog/">Blog</a>
        </li>
        <li>
          <a href="/blog/post/hello">Post hello</a>
        </li>
        <li>
          <a href="/blog/post/2019/05">Post data</a>
        </li>
        <li>
          <a href="/404">404</a>
        </li>
      </ul>

      <Router />
    </StoreContext.Provider>
  )
}
