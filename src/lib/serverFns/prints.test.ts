import { describe, it, expect, mock } from 'bun:test'
import { createTestDb } from '~/test/testDb'
const testDb = createTestDb()

mock.module('~/lib/db', () => ({ db: testDb }))
mock.module('@tanstack/react-start', () => ({
  createServerFn: () => ({ handler: (fn: (...args: unknown[]) => unknown) => fn }),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const project of projects as any[]) {
      expect(typeof project.id).toBe('string')
      expect(typeof project.name).toBe('string')
      expect(['planned', 'printing', 'printed']).toContain(project.status)
    }
  })

  it('gameId is undefined for projects with no associated game', () => {
    const projects = getPrintProjects()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generic = (projects as any[]).find((project: any) => project.id === 'p2')
    expect(generic?.gameId).toBeUndefined()
  })

  it('gameId is set for projects linked to a game', () => {
    const projects = getPrintProjects()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stands = (projects as any[]).find((project: any) => project.id === 'p1')
    expect(stands?.gameId).toBe('g1')
  })
})
