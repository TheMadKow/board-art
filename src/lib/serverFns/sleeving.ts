import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import type { Game, GameSleeve, SleeveStock } from '~/types'

type JoinRow = {
  game_id: string
  title: string
  owned: number
  sleeve_id: number | null
  name: string | null
  type: string | null
  needed: number | null
  sleeved: number | null
}
type StockRow = { id: string; brand: string; size: string; count_in_stock: number }

export type SleevingData = {
  games: Pick<Game, 'id' | 'title' | 'owned' | 'sleeves'>[]
  stock: SleeveStock[]
}

export const getSleevingData = createServerFn({ method: 'GET' }).handler((): SleevingData => {
  const rows = db.prepare(`
    SELECT g.id as game_id, g.title, g.owned,
           sl.id as sleeve_id, sl.name, sl.type, sl.needed, sl.sleeved
    FROM games g
    LEFT JOIN game_sleeves sl ON sl.game_id = g.id
    WHERE g.owned = 1 AND g.removed = 0
    ORDER BY g.title
  `).all() as JoinRow[]

  const stockRows = db.prepare('SELECT * FROM sleeve_stock ORDER BY brand, size').all() as StockRow[]

  const map = new Map<string, Pick<Game, 'id' | 'title' | 'owned' | 'sleeves'>>()
  for (const row of rows) {
    if (!map.has(row.game_id)) {
      map.set(row.game_id, {
        id: row.game_id,
        title: row.title,
        owned: true,
        sleeves: [],
      })
    }
    if (row.sleeve_id !== null) {
      map.get(row.game_id)!.sleeves.push({
        id: row.sleeve_id,
        name: row.name!,
        type: row.type!,
        needed: row.needed!,
        sleeved: row.sleeved!,
      } satisfies GameSleeve)
    }
  }

  return {
    games: [...map.values()],
    stock: stockRows.map((stock): SleeveStock => ({
      id: stock.id,
      brand: stock.brand,
      size: stock.size,
      countInStock: stock.count_in_stock,
    })),
  }
})
