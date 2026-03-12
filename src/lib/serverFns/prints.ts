import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import type { PrintProject } from '~/types'

type PrintRow = {
  id: string
  name: string
  game_id: string | null
  status: string
  notes: string | null
}

const VALID_STATUSES = ['planned', 'printing', 'printed'] as const

function assertValidStatus(value: string): PrintProject['status'] {
  if ((VALID_STATUSES as readonly string[]).includes(value)) return value as PrintProject['status']
  throw new Error(`Invalid print project status: "${value}"`)
}

export const getPrintProjects = createServerFn({ method: 'GET' }).handler((): PrintProject[] => {
  const rows = db.prepare('SELECT * FROM print_projects ORDER BY status, name').all() as PrintRow[]

  return rows.map((row): PrintProject => ({
    id: row.id,
    name: row.name,
    gameId: row.game_id ?? undefined,
    status: assertValidStatus(row.status),
    notes: row.notes ?? undefined,
  }))
})
