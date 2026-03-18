import { createServerFn } from "@tanstack/react-start";
import { db } from "~/lib/db";

export type Settings = {
  bggUsername: string | null;
};

export type SyncResult = {
  added: { title: string; bggId: string }[];
  removed: { title: string }[];
  unchanged: number;
};

export const getSettings = createServerFn({ method: "GET" }).handler((): Settings => {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("bgg_username") as {
    value: string;
  } | null;
  return { bggUsername: row?.value ?? null };
});

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { bggUsername: string })
  .handler(({ data }): void => {
    db.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    ).run("bgg_username", data.bggUsername.trim());
  });

// --- BGG helpers ---

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

function parseBggXml(xml: string): Array<{ bggId: string; title: string }> {
  const results: Array<{ bggId: string; title: string }> = [];
  const itemRegex = /<item\s[^>]*objectid="(\d+)"[^>]*>([\s\S]*?)<\/item>/g;
  const nameRegex = /<name\s[^>]*sortindex="1"[^>]*>([^<]+)<\/name>/;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const bggId = m[1];
    const nameMatch = m[2].match(nameRegex);
    if (nameMatch) {
      results.push({ bggId, title: decodeXmlEntities(nameMatch[1].trim()) });
    }
  }
  return results;
}

async function fetchBggCollection(
  username: string,
): Promise<Array<{ bggId: string; title: string }>> {
  const url =
    `https://boardgamegeek.com/xmlapi2/collection` +
    `?username=${encodeURIComponent(username)}&own=1&subtype=boardgame&excludesubtype=boardgameexpansion`;

  const headers = { "User-Agent": "BoardArt/1.0 (board game collection tracker)" };

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers });
    if (res.status === 202) {
      await new Promise((r) => setTimeout(r, 2500));
      continue;
    }
    if (res.status === 401) {
      throw new Error(`BGG collection for "${username}" is private`);
    }
    if (res.status === 404 || res.status === 400) {
      throw new Error(`BGG user "${username}" not found`);
    }
    if (!res.ok) {
      throw new Error(`BGG API error: ${res.status}`);
    }
    const xml = await res.text();
    return parseBggXml(xml);
  }
  throw new Error("BGG is taking too long to respond — please try again in a moment");
}

// --- Sync ---

type GameRecord = {
  id: string;
  title: string;
  bgg_id: string | null;
  owned: number;
  removed: number;
};

export const syncBggCollection = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { username: string })
  .handler(async ({ data }): Promise<SyncResult> => {
    const bggGames = await fetchBggCollection(data.username);

    const localGames = db
      .prepare("SELECT id, title, bgg_id, owned, removed FROM games")
      .all() as GameRecord[];

    const bggIdSet = new Set(bggGames.map((g) => g.bggId));
    const localByBggId = new Map(localGames.filter((g) => g.bgg_id).map((g) => [g.bgg_id!, g]));

    const added: SyncResult["added"] = [];
    const removed: SyncResult["removed"] = [];

    const insertGame = db.prepare(
      "INSERT INTO games (id, title, bgg_id, owned, removed) VALUES (?, ?, ?, 1, 0)",
    );
    const markRemoved = db.prepare("UPDATE games SET removed = 1 WHERE id = ?");
    const markRestored = db.prepare("UPDATE games SET removed = 0, owned = 1 WHERE id = ?");

    db.transaction(() => {
      for (const { bggId, title } of bggGames) {
        const existing = localByBggId.get(bggId);
        if (!existing) {
          insertGame.run(`bgg_${bggId}`, title, bggId);
          added.push({ title, bggId });
        } else if (existing.removed === 1) {
          markRestored.run(existing.id);
        }
      }

      for (const game of localGames) {
        if (game.bgg_id && game.owned === 1 && game.removed === 0 && !bggIdSet.has(game.bgg_id)) {
          markRemoved.run(game.id);
          removed.push({ title: game.title });
        }
      }
    })();

    return { added, removed, unchanged: bggGames.length - added.length };
  });
