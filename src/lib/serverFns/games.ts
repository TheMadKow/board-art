import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import type { Game, PlaySession } from '~/types'

type JoinRow = {
  game_id: string
  title: string
  bgg_id: string | null
  owned: number
  session_date: string | null
  players: number | null
  notes: string | null
}

export const getGames = createServerFn({ method: 'GET' }).handler((): Omit<Game, 'sleeves'>[] => {
  const rows = db.prepare(`
    SELECT g.id as game_id, g.title, g.bgg_id, g.owned,
           s.date as session_date, s.players, s.notes
    FROM games g
    LEFT JOIN play_sessions s ON s.game_id = g.id
    ORDER BY g.title, s.date DESC
  `).all() as JoinRow[]

  const map = new Map<string, Omit<Game, 'sleeves'>>()
  for (const row of rows) {
    if (!map.has(row.game_id)) {
      map.set(row.game_id, {
        id: row.game_id,
        title: row.title,
        bggId: row.bgg_id ?? undefined,
        owned: row.owned === 1,
        playLog: [],
      })
    }
    if (row.session_date !== null) {
      map.get(row.game_id)!.playLog.push({
        date: row.session_date,
        players: row.players!,
        notes: row.notes ?? undefined,
      } satisfies PlaySession)
    }
  }

  return [...map.values()]
})
