import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import type { Game, PlaySession } from '~/types'

type GameRow = { id: string; title: string; bgg_id: string | null; owned: number }
type SessionRow = { game_id: string; date: string; players: number; notes: string | null }

export const getGames = createServerFn({ method: 'GET' }).handler((): Game[] => {
  const gameRows = db.prepare('SELECT * FROM games ORDER BY title').all() as GameRow[]
  const sessionRows = db.prepare('SELECT * FROM play_sessions ORDER BY date DESC').all() as SessionRow[]

  return gameRows.map((g) => ({
    id: g.id,
    title: g.title,
    bggId: g.bgg_id ?? undefined,
    owned: g.owned === 1,
    playLog: sessionRows
      .filter((s) => s.game_id === g.id)
      .map((s): PlaySession => ({
        date: s.date,
        players: s.players,
        notes: s.notes ?? undefined,
      })),
    sleeves: [],
  }))
})
