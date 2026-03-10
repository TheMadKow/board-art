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
    games: gameRows.map((game) => ({
      id: game.id,
      title: game.title,
      owned: true,
      sleeves: sleeveRows
        .filter((sleeve) => sleeve.game_id === game.id)
        .map((sleeve): GameSleeve => ({
          name: sleeve.name,
          type: sleeve.type,
          needed: sleeve.needed,
          sleeved: sleeve.sleeved,
        })),
    })),
    stock: stockRows.map((stock): SleeveStock => ({
      id: stock.id,
      brand: stock.brand,
      size: stock.size,
      countInStock: stock.count_in_stock,
    })),
  }
})
