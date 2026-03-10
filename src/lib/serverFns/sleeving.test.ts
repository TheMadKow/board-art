import { describe, it, expect, mock } from 'bun:test'
import { createTestDb } from '~/test/testDb'

const testDb = createTestDb()

mock.module('~/lib/db', () => ({ db: testDb }))
mock.module('@tanstack/react-start', () => ({
  createServerFn: () => ({ handler: (fn: Function) => fn }),
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { getSleevingData } = await import('./sleeving') as any

describe('getSleevingData', () => {
  it('returns games and stock', () => {
    const data = getSleevingData()
    expect(Array.isArray(data.games)).toBe(true)
    expect(Array.isArray(data.stock)).toBe(true)
  })

  it('only includes owned games', () => {
    const data = getSleevingData()
    expect(data.games.every((game) => game.owned === true)).toBe(true)
    const arkNova = data.games.find((game) => game.id === 'g3')
    expect(arkNova).toBeUndefined()
  })

  it('sleeves are associated to the correct game', () => {
    const data = getSleevingData()
    const gloomhaven = data.games.find((game) => game.id === 'g1')
    expect(gloomhaven?.sleeves.length).toBe(1)
    expect(gloomhaven?.sleeves[0].name).toBe('Monster cards')
  })

  it('stock uses camelCase countInStock', () => {
    const data = getSleevingData()
    for (const s of data.stock) {
      expect(typeof s.countInStock).toBe('number')
      expect((s as Record<string, unknown>)['count_in_stock']).toBeUndefined()
    }
  })
})
