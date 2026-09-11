import { expect, test } from "vite-plus/test";

import { ENTRY, type Exposed, type Remotes, type Shared, UNSET } from "#federation/settings.ts";

test("names the entry without a hash, a host having to know it before it loads anything", () => {
  expect(ENTRY).toBe("remoteEntry.js");
  expect(ENTRY).not.toMatch(/-[A-Za-z0-9_]{8}\./u);
});

test("maps each imported name to the module behind it", () => {
  const held: Exposed = { "./Dashboard": "./src/dashboard.tsx" };

  expect(held["./Dashboard"]).toBe("./src/dashboard.tsx");
});

test("names each remote and says nothing about where it is", () => {
  const held: Remotes = ["remote"];

  expect(held).toEqual(["remote"]);
});

test("stands an unregistered remote at a name that never resolves", () => {
  expect(UNSET).toContain(".invalid");
});

test("says of a shared dependency whether there is one instance and which versions do", () => {
  const held: Shared = { react: { requiredVersion: "^19.0.0", singleton: true } };

  expect(held["react"]?.singleton).toBe(true);
});
