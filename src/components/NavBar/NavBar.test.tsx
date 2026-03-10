import { describe, it, expect } from 'bun:test'
import { render } from '@testing-library/react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterContextProvider,
  createMemoryHistory,
} from '@tanstack/react-router'
import NavBar from './NavBar'

function makeRouter() {
  const root = createRootRoute()
  return createRouter({
    routeTree: root.addChildren([
      createRoute({ getParentRoute: () => root, path: '/' }),
      createRoute({ getParentRoute: () => root, path: '/library' }),
      createRoute({ getParentRoute: () => root, path: '/sleeving' }),
      createRoute({ getParentRoute: () => root, path: '/prints' }),
    ]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
}

describe('NavBar', () => {
  it('renders the BoardArt logo', () => {
    const { getByText } = render(
      <RouterContextProvider router={makeRouter()}>
        <NavBar />
      </RouterContextProvider>,
    )
    expect(getByText('Art')).toBeTruthy()
  })

  it('renders all navigation links', () => {
    const { getByText } = render(
      <RouterContextProvider router={makeRouter()}>
        <NavBar />
      </RouterContextProvider>,
    )
    expect(getByText('Dashboard')).toBeTruthy()
    expect(getByText('Library')).toBeTruthy()
    expect(getByText('Sleeving')).toBeTruthy()
    expect(getByText('3D Prints')).toBeTruthy()
  })
})
