import { describe, expect, it } from "vitest";

import { type Changed, type Indexing, pageOf, pathOf, reindexes, retyped } from "#changed.ts";
import { listings } from "#emit.ts";

const ROOT = "/work";

const FILE = `${ROOT}/src/badge/badge.specimen.tsx`;

const PATTERNS = ["src/**/*.specimen.tsx"];

function page(id: string, title = ""): string {
  const named = title === "" ? "" : `, title: "${title}"`;

  return `export default specimen({ id: "${id}"${named}, scenes: [] });\n`;
}

function indexing(text: string): Indexing {
  const resolved = { command: "serve", root: ROOT } as const;

  return { last: listings(resolved, [{ path: FILE, text }]), resolved };
}

function update(text: string, type: Changed["type"] = "update", file = FILE): Changed {
  return { file, read: (): Promise<string> => Promise.resolve(text), type };
}

describe("changed", () => {
  it("returns false when the file matches no pattern", async () => {
    await expect(
      reindexes(indexing(page("data/badge")), PATTERNS, update("", "update", `${ROOT}/src/a.ts`)),
    ).resolves.toBe(false);
  });

  it("returns true when a specimen file appeared", async () => {
    await expect(
      reindexes(indexing(page("data/badge")), PATTERNS, update(page("data/badge"), "create")),
    ).resolves.toBe(true);
  });

  it("returns true when a specimen file is gone", async () => {
    await expect(
      reindexes(indexing(page("data/badge")), PATTERNS, update("", "delete")),
    ).resolves.toBe(true);
  });

  it("returns true when an edit changed the metadata the page declares", async () => {
    await expect(
      reindexes(indexing(page("data/badge")), PATTERNS, update(page("data/badge", "Chip"))),
    ).resolves.toBe(true);
  });

  it("returns false when an edit left the metadata alone", async () => {
    await expect(
      reindexes(indexing(page("data/badge")), PATTERNS, update(page("data/badge"))),
    ).resolves.toBe(false);
  });

  it.each([
    { give: `${ROOT}/src/badge/badge.ts`, want: true },
    { give: `${ROOT}/src/badge/badge.tsx`, want: true },
    { give: `${ROOT}/src/badge/badge.mjs`, want: true },
    { give: `${ROOT}/src/badge/styles.css`, want: false },
    { give: "/elsewhere/badge.ts", want: false },
  ])("reads $give as making the compiler stale: $want", ({ give, want }) => {
    expect(retyped([`${ROOT}/src`], give)).toBe(want);
  });

  it("returns the identifier of the page a file declares", () => {
    expect(pageOf(indexing(page("data/badge")), FILE)).toBe("data/badge");
  });

  it("returns nothing for a file the index lists no page for", () => {
    expect(pageOf(indexing(page("data/badge")), `${ROOT}/src/a.ts`)).toBeUndefined();
  });

  it("resolves a page identifier to the file it was read from", () => {
    expect(pathOf(indexing(page("data/badge")), "data/badge")).toBe(FILE);
  });

  it("throws when no listed page carries the identifier", () => {
    expect(() => pathOf(indexing(page("data/badge")), "data/chip")).toThrow(
      /no page is called data\/chip/u,
    );
  });
});
