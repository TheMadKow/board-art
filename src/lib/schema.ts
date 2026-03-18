export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS games (
    id        TEXT PRIMARY KEY,
    title     TEXT NOT NULL,
    bgg_id    TEXT,
    owned     INTEGER NOT NULL DEFAULT 1,
    removed   INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
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
`;
