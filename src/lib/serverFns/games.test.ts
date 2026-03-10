import { describe, it, expect, mock } from 'bun:test'
import { createTestDb } from '~/test/testDb'

const testDb = createTestDb()

mock.module('~/lib/db', () => ({ db: testDb }))
mock.module('@tanstack/react-start', () => ({
  createServerFn: () => ({ handler: (fn: Function) => fn }),
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { getGames } = await import('./games') as any

describe('getGames', () => {
  it('returns an array of games', () => {
    const games = getGames()
    expect(Array.isArray(games)).toBe(true)
    expect(games.length).toBeGreaterThan(0)
  })

  it('each game has the expected shape', () => {
    const games = getGames()
    for (const game of games) {
      expect(typeof game.id).toBe('string')
      expect(typeof game.title).toBe('string')
      expect(typeof game.owned).toBe('boolean')
      expect(Array.isArray(game.playLog)).toBe(true)
      expect(Array.isArray(game.sleeves)).toBe(true)
    }
  })

  it('owned is a boolean (not 0/1 integer)', () => {
    const games = getGames()
    const gloomhaven = games.find((game) => game.id === 'g1')
    expect(gloomhaven?.owned).toBe(true)
    const arkNova = games.find((game) => game.id === 'g3')
    expect(arkNova?.owned).toBe(false)
  })

  it('playLog entries are associated to the correct game', () => {
    const games = getGames()
    const gloomhaven = games.find((game) => game.id === 'g1')
    expect(gloomhaven?.playLog.length).toBe(2)
    const wingspan = games.find((game) => game.id === 'g2')
    expect(wingspan?.playLog.length).toBe(1)
  })

  it('null notes become undefined', () => {
    const games = getGames()
    const gloomhaven = games.find((game) => game.id === 'g1')
    const sessionWithoutNotes = gloomhaven?.playLog.find((session) => session.notes === undefined)
    expect(sessionWithoutNotes).toBeTruthy()
  })
})
