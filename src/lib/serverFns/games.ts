import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import type { Game, PlaySession } from '~/types'

type GameRow = { id: string; title: string; bgg_id: string | null; owned: number }
type SessionRow = { game_id: string; date: string; players: number; notes: string | null }

export const getGames = createServerFn({ method: 'GET' }).handler((): Game[] => {
  const gameRows = db.prepare('SELECT * FROM games ORDER BY title').all() as GameRow[]
  const sessionRows = db.prepare('SELECT * FROM play_sessions ORDER BY date DESC').all() as SessionRow[]

  return gameRows.map((game) => ({
    id: game.id,
    title: game.title,
    bggId: game.bgg_id ?? undefined,
    owned: game.owned === 1,
    playLog: sessionRows
      .filter((session) => session.game_id === game.id)
      .map((session): PlaySession => ({
        date: session.date,
        players: session.players,
        notes: session.notes ?? undefined,
      })),
    sleeves: [],
  }))
})
