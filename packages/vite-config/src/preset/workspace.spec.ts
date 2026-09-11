import { expect, test } from "vite-plus/test";

import { type Layer } from "@stealthscale/vite-config-core";

import { workspace } from "#preset/workspace.ts";

/**
 * Names every layer the set hands over.
 *
 * @returns Each name, flattened.
 */
function names(): string[] {
  const flat: Layer[] = workspace().flatMap((held) =>
    Array.isArray(held) ? (held as Layer[]) : [held as Layer],
  );

  return flat.map((one) => one.name);
}

test("states what the task runner reads once for the whole tree", () => {
  const held = names();

  expect(held).toContain("run.cache");
  expect(held).toContain("run.ci");
});

test("states what happens before a commit, there being one hook per repository", () => {
  const held = names();

  expect(held).toContain("staged.checked");
  expect(held).toContain("staged.formatted");
});

test("states the projects, which is what a root has instead of tests of its own", () => {
  expect(names()).toContain("test.projects");
});

test("leaves the names unowned, so a repository takes one back by the name it knows", () => {
  for (const name of names()) expect(name).not.toContain("/");
});

test("packs nothing and builds nothing, a root config being no package", () => {
  const held = names().join();

  expect(held).not.toContain("pack.");
  expect(held).not.toContain("build.");
});
