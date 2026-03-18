import { describe, it, expect, mock } from "bun:test";
import { createTestDb } from "~/test/testDb";

const testDb = createTestDb();

mock.module("~/lib/db", () => ({ db: testDb }));
mock.module("@tanstack/react-start", () => ({
  createServerFn: () => ({ handler: (fn: (...args: unknown[]) => unknown) => fn }),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { getGames } = (await import("./games")) as any;

describe("getGames", () => {
  it("returns an array of games", () => {
    const games = getGames();
    expect(Array.isArray(games)).toBe(true);
    expect(games.length).toBeGreaterThan(0);
  });

  it("each game has the expected shape", () => {
    const games = getGames();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const game of games as any[]) {
      expect(typeof game.id).toBe("string");
      expect(typeof game.title).toBe("string");
      expect(typeof game.owned).toBe("boolean");
      expect(Array.isArray(game.playLog)).toBe(true);
    }
  });

  it("owned is a boolean (not 0/1 integer)", () => {
    const games = getGames();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gloomhaven = (games as any[]).find((game: any) => game.id === "g1");
    expect(gloomhaven?.owned).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arkNova = (games as any[]).find((game: any) => game.id === "g3");
    expect(arkNova?.owned).toBe(false);
  });

  it("playLog entries are associated to the correct game", () => {
    const games = getGames();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gloomhaven = (games as any[]).find((game: any) => game.id === "g1");
    expect(gloomhaven?.playLog.length).toBe(2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wingspan = (games as any[]).find((game: any) => game.id === "g2");
    expect(wingspan?.playLog.length).toBe(1);
  });

  it("null notes become undefined", () => {
    const games = getGames();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gloomhaven = (games as any[]).find((game: any) => game.id === "g1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionWithoutNotes = gloomhaven?.playLog.find(
      (session: any) => session.notes === undefined,
    );
    expect(sessionWithoutNotes).toBeTruthy();
  });
});
