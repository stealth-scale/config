import { expect, test, vi } from "vite-plus/test";

import { endpoints, join } from "#endpoints.ts";

/**
 * What the federation runtime was told, in place of telling it.
 */
const registered: unknown[][] = [];

vi.mock("@module-federation/runtime", () => ({
  registerRemotes: (held: unknown[]): void => {
    registered.push(held);
  },
}));

/**
 * Answers a fetch with the given body, the way a deployment serving the file would.
 *
 * @param body - What the file holds.
 * @param ok - Whether the file is there at all.
 */
function serving(body: unknown, ok = true): void {
  vi.stubGlobal("fetch", () =>
    Promise.resolve({ json: () => Promise.resolve(body), ok, status: ok ? 200 : 404 }),
  );
}

test("reads every endpoint the deployment named", async () => {
  serving([{ entry: "https://app1.example.test/remoteEntry.js", name: "remote" }]);

  await expect(endpoints("/remotes.json")).resolves.toEqual([
    { entry: "https://app1.example.test/remoteEntry.js", name: "remote" },
  ]);
});

test("passes over an entry missing either half, the pair being what makes it one", async () => {
  serving([{ name: "remote" }, { entry: "https://a.test/e.js" }, 7, null]);

  await expect(endpoints("/remotes.json")).resolves.toEqual([]);
});

test("answers nothing where the deployment named nothing", async () => {
  serving([]);

  await expect(endpoints("/remotes.json")).resolves.toEqual([]);
});

test("answers nothing where the file holds something other than a list", async () => {
  serving({ remote: "https://a.test/e.js" });

  await expect(endpoints("/remotes.json")).resolves.toEqual([]);
});

test("refuses a deployment serving no such file, which is an incomplete one", async () => {
  serving(undefined, false);

  await expect(endpoints("/remotes.json")).rejects.toThrow(/was answered 404/u);
});

test("tells the runtime where each application is, in the shape it takes", () => {
  join([{ entry: "https://app1.example.test/remoteEntry.js", name: "remote" }]);

  expect(registered.at(-1)).toEqual([
    { entry: "https://app1.example.test/remoteEntry.js", name: "remote", type: "module" },
  ]);
});

test("tells it nothing where the deployment named nothing", () => {
  join([]);

  expect(registered.at(-1)).toEqual([]);
});
