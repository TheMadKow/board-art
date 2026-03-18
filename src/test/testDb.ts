import { Database } from "bun:sqlite";
import { SCHEMA_SQL } from "~/lib/schema";

export function createTestDb(): Database {
  const db = new Database(":memory:");
  db.exec("PRAGMA foreign_keys = ON");

  db.exec(SCHEMA_SQL);

  const insertGame = db.prepare("INSERT INTO games (id, title, bgg_id, owned) VALUES (?, ?, ?, ?)");
  const insertSession = db.prepare(
    "INSERT INTO play_sessions (game_id, date, players, notes) VALUES (?, ?, ?, ?)",
  );
  const insertSleeve = db.prepare(
    "INSERT INTO game_sleeves (game_id, name, type, needed, sleeved) VALUES (?, ?, ?, ?, ?)",
  );
  const insertStock = db.prepare(
    "INSERT INTO sleeve_stock (id, brand, size, count_in_stock) VALUES (?, ?, ?, ?)",
  );
  const insertPrint = db.prepare(
    "INSERT INTO print_projects (id, name, game_id, status, notes) VALUES (?, ?, ?, ?, ?)",
  );

  db.transaction(() => {
    insertGame.run("g1", "Gloomhaven", "174430", 1);
    insertGame.run("g2", "Wingspan", "266192", 1);
    insertGame.run("g3", "Ark Nova", "342942", 0);

    insertSession.run("g1", "2026-01-10", 3, "Scenario 1");
    insertSession.run("g1", "2026-01-24", 3, null);
    insertSession.run("g2", "2026-02-14", 4, "Game night");

    insertSleeve.run("g1", "Monster cards", "Mayday Premium (63×88mm)", 504, 504);
    insertSleeve.run("g2", "Bird cards", "Swan Panasia (63×88mm)", 170, 170);

    insertStock.run("s1", "Mayday", "Standard (63×88mm)", 400);
    insertStock.run("s2", "Swan Panasia", "Standard (63×88mm)", 300);

    insertPrint.run("p1", "Gloomhaven Stands", "g1", "printed", "3 sets done");
    insertPrint.run("p2", "Generic Holder", null, "planned", null);
  })();

  return db;
}
