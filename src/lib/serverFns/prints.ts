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

export const getPrintProjects = createServerFn({ method: 'GET' }).handler((): PrintProject[] => {
  const rows = db.prepare('SELECT * FROM print_projects ORDER BY status, name').all() as PrintRow[]

  return rows.map((row): PrintProject => ({
    id: row.id,
    name: row.name,
    gameId: row.game_id ?? undefined,
    status: row.status as PrintProject['status'],
    notes: row.notes ?? undefined,
  }))
})
