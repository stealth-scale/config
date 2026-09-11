import { expect, test } from "vite-plus/test";

import { remote } from "#remote.ts";

/**
 * Where the other application says it serves its files from.
 */
const AT = "http://localhost:4403/";

/**
 * A manifest of the shape a build writes.
 */
const BUILT = {
  "src/main.tsx": { css: ["assets/main-DEF456.css"], file: "assets/main-ABC123.js", isEntry: true },
  "src/panel.css": { file: "assets/panel-GHI789.css" },
};

test("answers the hashed file the entry became, which nothing outside the build could guess", () => {
  expect(remote(BUILT, AT).url).toBe("http://localhost:4403/assets/main-ABC123.js");
});

test("answers absolute URLs, a path alone being read as one on the host's own origin", () => {
  expect(remote(BUILT, AT).styles).toEqual(["http://localhost:4403/assets/main-DEF456.css"]);
});

test("passes over a chunk that is not an entry, however much else the manifest holds", () => {
  expect(remote(BUILT, AT).url).not.toContain("panel");
});

test("answers no stylesheets where the entry needs none", () => {
  expect(remote({ "src/main.tsx": { file: "assets/m.js", isEntry: true } }, AT).styles).toEqual([]);
});

test("passes over a stylesheet list holding something that is not a path", () => {
  const held = { "src/main.tsx": { css: [7, "a.css"], file: "m.js", isEntry: true } };

  expect(remote(held, AT).styles).toEqual(["http://localhost:4403/a.css"]);
});

test("passes over an entry naming no file, and keeps looking", () => {
  const held = {
    "src/broken.tsx": { isEntry: true },
    "src/main.tsx": { file: "assets/m.js", isEntry: true },
  };

  expect(remote(held, AT).url).toBe("http://localhost:4403/assets/m.js");
});

test("passes over a chunk that is not an object at all", () => {
  expect(remote({ bad: null, "src/main.tsx": { file: "m.js", isEntry: true } }, AT).url).toContain(
    "m.js",
  );
});

test("refuses a manifest marking no entry, which is not one a host can load", () => {
  expect(() => remote({ "src/panel.css": { file: "p.css" } }, AT)).toThrow(/found no entry/u);
});

test("refuses an empty manifest", () => {
  expect(() => remote({}, AT)).toThrow(/found no entry/u);
});
