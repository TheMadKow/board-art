import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Default tanstack-router export
export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })

  return router
}
