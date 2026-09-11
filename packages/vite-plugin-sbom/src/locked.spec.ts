import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";

import { locked } from "#locked.ts";

/**
 * Writes a workspace holding a lockfile, and answers a directory inside it.
 *
 * Written with the trailing commas bun writes, since reading past those is half of what the reader
 * is for.
 *
 * @param packages - The `packages` object, as JSON text without its braces.
 * @returns A directory two levels below the lockfile.
 */
function workspace(packages: string): string {
  const root = mkdtempSync(join(tmpdir(), "stealth-locked-"));
  const at = join(root, "packages", "one");

  mkdirSync(at, { recursive: true });
  writeFileSync(join(root, "bun.lock"), `{\n  "packages": {\n${packages}\n  },\n}\n`);

  return at;
}

test("reads a registry package, which names no registry of its own", () => {
  const held = locked(workspace('    "wrappy": ["wrappy@1.0.2", "", {}, "sha512-abc"],'));

  expect(held.get("wrappy")).toEqual({ integrity: "sha512-abc", resolution: "1.0.2" });
});

test("reads a git package, whose resolution is where it came from", () => {
  const held = locked(
    workspace('    "once": ["once@github:isaacs/once#0fbb41e", {}, "isaacs", "sha512-def"],'),
  );

  expect(held.get("once")?.resolution).toBe("github:isaacs/once#0fbb41e");
  expect(held.get("once")?.integrity).toBe("sha512-def");
});

test("reads a scoped name whole, the version being what follows the last marker", () => {
  const held = locked(workspace('    "@types/bun": ["@types/bun@1.4.2", "", {}, "sha512-ghi"],'));

  expect(held.get("@types/bun")?.resolution).toBe("1.4.2");
});

test("records a registry that is not the default one", () => {
  const held = locked(
    workspace('    "held": ["held@1.0.0", "https://npm.acme.test/", {}, "sha512-jkl"],'),
  );

  expect(held.get("held")?.registry).toBe("https://npm.acme.test/");
});

test("passes over an entry whose first slot names no version at all", () => {
  expect(locked(workspace('    "held": ["held", "", {}],')).size).toBe(0);
});

test("passes over an entry that is not a list", () => {
  expect(locked(workspace('    "held": { "not": "a list" },')).size).toBe(0);
});

test("answers nothing where the lockfile holds no packages", () => {
  const root = mkdtempSync(join(tmpdir(), "stealth-locked-"));

  writeFileSync(join(root, "bun.lock"), '{ "lockfileVersion": 2 }');

  expect(locked(root).size).toBe(0);
});

test("passes over an entry naming nothing it can read", () => {
  expect(locked(workspace('    "held": [3, "", {}],')).size).toBe(0);
});

test("answers nothing where the workspace holds no lockfile it knows", () => {
  expect(locked(mkdtempSync(join(tmpdir(), "stealth-locked-"))).size).toBe(0);
});

test("answers nothing where the lockfile does not parse", () => {
  const root = mkdtempSync(join(tmpdir(), "stealth-locked-"));

  writeFileSync(join(root, "bun.lock"), "{ not json");

  expect(locked(root).size).toBe(0);
});

test("reads an entry that records no integrity", () => {
  const held = locked(workspace('    "held": ["held@1.0.0", "", {}],'));

  expect(held.get("held")).toEqual({ resolution: "1.0.0" });
});

/**
 * Writes a workspace holding a pnpm lockfile, and answers a directory inside it.
 *
 * @param yaml - What follows `packages:`, indented as the lockfile indents it.
 * @param ahead - A document to write before the lockfile proper, as pnpm writes one.
 * @returns A directory two levels below the lockfile.
 */
function pnpm(yaml: string, ahead?: string): string {
  const root = mkdtempSync(join(tmpdir(), "stealth-locked-"));
  const at = join(root, "packages", "one");
  const first = ahead === undefined ? "" : `${ahead}\n---\n`;

  mkdirSync(at, { recursive: true });
  writeFileSync(
    join(root, "pnpm-lock.yaml"),
    `${first}lockfileVersion: '9.0'\n\npackages:\n${yaml}`,
  );

  return at;
}

test("reads a registry package out of a pnpm lockfile", () => {
  const held = pnpm("  wrappy@1.0.2:\n    resolution: {integrity: sha512-abc}\n");

  expect(locked(held).get("wrappy")).toEqual({ integrity: "sha512-abc" });
});

test("reads a scoped name whole there too, the version following the last marker", () => {
  const held = pnpm("  '@types/node@26.5.1':\n    resolution: {integrity: sha512-def}\n");

  expect(locked(held).get("@types/node")?.integrity).toBe("sha512-def");
});

test("records where a package came from when it did not come from the default registry", () => {
  const held = pnpm(
    "  once@1.4.1:\n    resolution: {tarball: https://codeload.github.com/isaacs/once/tar.gz/0fbb41e}\n",
  );

  expect(locked(held).get("once")?.registry).toBe(
    "https://codeload.github.com/isaacs/once/tar.gz/0fbb41e",
  );
});

test("reads past the document pnpm writes about its own build", () => {
  const held = pnpm(
    "  wrappy@1.0.2:\n    resolution: {integrity: sha512-abc}\n",
    "packages:\n  '@pnpm/exe.linux-x64@12.4.1':\n    resolution: {integrity: sha512-self}",
  );

  expect(locked(held).get("wrappy")?.integrity).toBe("sha512-abc");
});

test("records a git remote, which a pnpm entry states as a url rather than a tarball", () => {
  const held = pnpm(
    "  held@1.0.0:\n    resolution: {type: git, url: git+ssh://git@github.com/acme/held.git}\n",
  );

  expect(locked(held).get("held")?.registry).toBe("git+ssh://git@github.com/acme/held.git");
});

test("records where a package came from when the key holds that in place of a version", () => {
  const held = pnpm(
    "  once@github.com/isaacs/once/0fbb41e:\n    resolution: {integrity: sha512-m}\n",
  );

  expect(locked(held).get("once")?.resolution).toBe("github.com/isaacs/once/0fbb41e");
});

test("passes over a pnpm entry that records no resolution", () => {
  const held = pnpm("  held@1.0.0:\n    cpu: [x64]\n");

  expect(locked(held).size).toBe(0);
});

test("passes over a pnpm entry written with nothing under it", () => {
  const held = pnpm("  held@1.0.0:\n");

  expect(locked(held).size).toBe(0);
});

test("passes over a document holding nothing, and reads the one that follows it", () => {
  const held = pnpm("  wrappy@1.0.2:\n    resolution: {integrity: sha512-abc}\n", "---");

  expect(locked(held).get("wrappy")?.integrity).toBe("sha512-abc");
});

test("passes over a pnpm key that divides nowhere", () => {
  const held = pnpm("  held:\n    resolution: {integrity: sha512-abc}\n");

  expect(locked(held).size).toBe(0);
});

test("answers an empty map where a pnpm lockfile records no packages", () => {
  const held = pnpm("");

  expect(locked(held).size).toBe(0);
});
