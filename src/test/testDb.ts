import { Database } from 'bun:sqlite'

export function createTestDb(): Database {
  const db = new Database(':memory:')
  db.exec('PRAGMA foreign_keys = ON')

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

  const insertGame = db.prepare('INSERT INTO games (id, title, bgg_id, owned) VALUES (?, ?, ?, ?)')
  const insertSession = db.prepare('INSERT INTO play_sessions (game_id, date, players, notes) VALUES (?, ?, ?, ?)')
  const insertSleeve = db.prepare('INSERT INTO game_sleeves (game_id, name, type, needed, sleeved) VALUES (?, ?, ?, ?, ?)')
  const insertStock = db.prepare('INSERT INTO sleeve_stock (id, brand, size, count_in_stock) VALUES (?, ?, ?, ?)')
  const insertPrint = db.prepare('INSERT INTO print_projects (id, name, game_id, status, notes) VALUES (?, ?, ?, ?, ?)')

  db.transaction(() => {
    insertGame.run('g1', 'Gloomhaven', '174430', 1)
    insertGame.run('g2', 'Wingspan', '266192', 1)
    insertGame.run('g3', 'Ark Nova', '342942', 0)

    insertSession.run('g1', '2026-01-10', 3, 'Scenario 1')
    insertSession.run('g1', '2026-01-24', 3, null)
    insertSession.run('g2', '2026-02-14', 4, 'Game night')

    insertSleeve.run('g1', 'Monster cards', 'Mayday Premium (63×88mm)', 504, 504)
    insertSleeve.run('g2', 'Bird cards', 'Swan Panasia (63×88mm)', 170, 170)

    insertStock.run('s1', 'Mayday', 'Standard (63×88mm)', 400)
    insertStock.run('s2', 'Swan Panasia', 'Standard (63×88mm)', 300)

    insertPrint.run('p1', 'Gloomhaven Stands', 'g1', 'printed', '3 sets done')
    insertPrint.run('p2', 'Generic Holder', null, 'planned', null)
  })()

  return db
}
