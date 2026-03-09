import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'

const DATA_DIR = path.resolve('data')
const DB_PATH = path.join(DATA_DIR, 'boardart.db')

function initDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id        TEXT PRIMARY KEY,
      title     TEXT NOT NULL,
      bgg_id    TEXT,
      owned     INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS play_sessions (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id  TEXT NOT NULL REFERENCES games(id),
      date     TEXT NOT NULL,
      players  INTEGER NOT NULL,
      notes    TEXT
    );

    CREATE TABLE IF NOT EXISTS game_sleeves (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id  TEXT NOT NULL REFERENCES games(id),
      name     TEXT NOT NULL,
      type     TEXT NOT NULL,
      needed   INTEGER NOT NULL DEFAULT 0,
      sleeved  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sleeve_stock (
      id             TEXT PRIMARY KEY,
      brand          TEXT NOT NULL,
      size           TEXT NOT NULL,
      count_in_stock INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS print_projects (
      id       TEXT PRIMARY KEY,
      name     TEXT NOT NULL,
      game_id  TEXT REFERENCES games(id),
      status   TEXT NOT NULL DEFAULT 'planned',
      notes    TEXT
    );
  `)

  // Seed only if empty
  const count = (db.prepare('SELECT COUNT(*) as n FROM games').get() as { n: number }).n
  if (count === 0) {
    seed(db)
  }

  return db
}

function seed(db: Database.Database) {
  const insertGame = db.prepare(
    'INSERT INTO games (id, title, bgg_id, owned) VALUES (?, ?, ?, ?)'
  )
  const insertSession = db.prepare(
    'INSERT INTO play_sessions (game_id, date, players, notes) VALUES (?, ?, ?, ?)'
  )
  const insertSleeve = db.prepare(
    'INSERT INTO game_sleeves (game_id, name, type, needed, sleeved) VALUES (?, ?, ?, ?, ?)'
  )
  const insertStock = db.prepare(
    'INSERT INTO sleeve_stock (id, brand, size, count_in_stock) VALUES (?, ?, ?, ?)'
  )
  const insertPrint = db.prepare(
    'INSERT INTO print_projects (id, name, game_id, status, notes) VALUES (?, ?, ?, ?, ?)'
  )

  const seedAll = db.transaction(() => {
    insertGame.run('g1', 'Gloomhaven', '174430', 1)
    insertGame.run('g2', 'Wingspan', '266192', 1)
    insertGame.run('g3', 'Terraforming Mars', '167791', 1)
    insertGame.run('g4', 'Root', '237182', 1)
    insertGame.run('g5', 'Spirit Island', '162886', 1)
    insertGame.run('g6', 'Ark Nova', '342942', 0)

    insertSession.run('g1', '2026-01-10', 3, 'Scenario 1 — victory!')
    insertSession.run('g1', '2026-01-24', 3, 'Scenario 2')
    insertSession.run('g1', '2026-02-07', 4, null)
    insertSession.run('g2', '2026-01-05', 2, null)
    insertSession.run('g2', '2026-02-14', 4, 'Valentines game night')
    insertSession.run('g3', '2025-12-28', 3, null)
    insertSession.run('g3', '2026-03-01', 2, null)
    insertSession.run('g4', '2026-02-22', 4, null)

    insertSleeve.run('g1', 'Monster ability cards', 'Mayday Premium (63×88mm)', 504, 504)
    insertSleeve.run('g1', 'Item cards', 'Mayday Standard (63×88mm)', 154, 154)
    insertSleeve.run('g1', 'Attack modifier cards', 'Mayday Standard (63×88mm)', 450, 200)
    insertSleeve.run('g2', 'Bird cards', 'Swan Panasia (63×88mm)', 170, 170)
    insertSleeve.run('g2', 'Bonus cards', 'Swan Panasia (63×88mm)', 26, 26)
    insertSleeve.run('g3', 'Project cards', 'Mayday Standard (63×88mm)', 208, 208)
    insertSleeve.run('g3', 'Corporation cards', 'Mayday Standard (63×88mm)', 12, 12)
    insertSleeve.run('g3', 'Prelude cards', 'Mayday Standard (63×88mm)', 35, 0)

    insertStock.run('s1', 'Mayday', 'Standard (63×88mm)', 400)
    insertStock.run('s2', 'Mayday', 'Premium (63×88mm)', 150)
    insertStock.run('s3', 'Swan Panasia', 'Standard (63×88mm)', 300)
    insertStock.run('s4', 'Mayday', 'Mini (44×68mm)', 200)
    insertStock.run('s5', 'FFG', 'Mini American (41×63mm)', 50)

    insertPrint.run('p1', 'Gloomhaven Monster Stands', 'g1', 'printed', '3 full sets done')
    insertPrint.run('p2', 'Wingspan Bird Feeder Dice Tower', 'g2', 'printed', null)
    insertPrint.run('p3', 'Terraforming Mars Player Trays', 'g3', 'printing', 'Currently on 3rd set')
    insertPrint.run('p4', 'Root Faction Tokens', 'g4', 'planned', null)
    insertPrint.run('p5', 'Spirit Island Custom Island Board', 'g5', 'planned', 'Need to find a good model')
    insertPrint.run('p6', 'Generic Card Holder — Small', null, 'printed', null)
    insertPrint.run('p7', 'Insert Organizer v2', null, 'planned', 'Universal design for medium boxes')
  })

  seedAll()
}

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined
}

export const db: Database.Database = globalThis.__db ?? (globalThis.__db = initDb())
