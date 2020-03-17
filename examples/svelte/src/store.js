import { createStoreon } from 'storeon'

import { createRouter } from '../../../'

export const store = createStoreon([
  createRouter([
    ['/', () => ({ page: 'home' })],
    ['/blog', () => ({ page: 'blog' })]
  ])
])
