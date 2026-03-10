import { describe, it, expect, mock } from 'bun:test'
import { createTestDb } from '~/test/testDb'
const testDb = createTestDb()

mock.module('~/lib/db', () => ({ db: testDb }))
mock.module('@tanstack/react-start', () => ({
  createServerFn: () => ({ handler: (fn: Function) => fn }),
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { getPrintProjects } = await import('./prints') as any

describe('getPrintProjects', () => {
  it('returns an array of print projects', () => {
    const projects = getPrintProjects()
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project has the expected shape', () => {
    const projects = getPrintProjects()
    for (const p of projects) {
      expect(typeof p.id).toBe('string')
      expect(typeof p.name).toBe('string')
      expect(['planned', 'printing', 'printed']).toContain(p.status)
    }
  })

  it('gameId is undefined for projects with no associated game', () => {
    const projects = getPrintProjects()
    const generic = projects.find((p) => p.id === 'p2')
    expect(generic?.gameId).toBeUndefined()
  })

  it('gameId is set for projects linked to a game', () => {
    const projects = getPrintProjects()
    const stands = projects.find((p) => p.id === 'p1')
    expect(stands?.gameId).toBe('g1')
  })
})
