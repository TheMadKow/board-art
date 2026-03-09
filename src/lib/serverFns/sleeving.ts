import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import type { Game, GameSleeve, SleeveStock } from '~/types'

type GameRow = { id: string; title: string; bgg_id: string | null; owned: number }
type SleeveRow = { game_id: string; name: string; type: string; needed: number; sleeved: number }
type StockRow = { id: string; brand: string; size: string; count_in_stock: number }

export type SleevingData = {
  games: Pick<Game, 'id' | 'title' | 'owned' | 'sleeves'>[]
  stock: SleeveStock[]
}

export const getSleevingData = createServerFn({ method: 'GET' }).handler((): SleevingData => {
  const gameRows = db.prepare('SELECT * FROM games WHERE owned = 1 ORDER BY title').all() as GameRow[]
  const sleeveRows = db.prepare('SELECT * FROM game_sleeves').all() as SleeveRow[]
  const stockRows = db.prepare('SELECT * FROM sleeve_stock ORDER BY brand, size').all() as StockRow[]

  return {
    games: gameRows.map((g) => ({
      id: g.id,
      title: g.title,
      owned: true,
      sleeves: sleeveRows
        .filter((s) => s.game_id === g.id)
        .map((s): GameSleeve => ({
          name: s.name,
          type: s.type,
          needed: s.needed,
          sleeved: s.sleeved,
        })),
    })),
    stock: stockRows.map((s): SleeveStock => ({
      id: s.id,
      brand: s.brand,
      size: s.size,
      countInStock: s.count_in_stock,
    })),
  }
})
