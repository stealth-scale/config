import { describe, expect, it, vi } from "vitest";

import { endpoints, join } from "#endpoints.ts";

/**
 * What the federation runtime was told, in place of telling it.
 */
const registered: unknown[][] = [];

vi.mock(import("@module-federation/runtime"), () => ({
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

describe("endpoints", () => {
  it("reads every endpoint the deployment named", async () => {
    serving([{ entry: "https://app1.example.test/remoteEntry.js", name: "remote" }]);

    await expect(endpoints("/remotes.json")).resolves.toStrictEqual([
      { entry: "https://app1.example.test/remoteEntry.js", name: "remote" },
    ]);
  });

  it("ignores an entry missing either half", async () => {
    serving([{ name: "remote" }, { entry: "https://a.test/e.js" }, 7, null]);

    await expect(endpoints("/remotes.json")).resolves.toStrictEqual([]);
  });

  it("returns undefined when the deployment named nothing", async () => {
    serving([]);

    await expect(endpoints("/remotes.json")).resolves.toStrictEqual([]);
  });

  it("returns undefined when the file holds something other than an array", async () => {
    serving({ remote: "https://a.test/e.js" });

    await expect(endpoints("/remotes.json")).resolves.toStrictEqual([]);
  });

  it("throws when the deployment serves no such file", async () => {
    serving(undefined, false);

    await expect(endpoints("/remotes.json")).rejects.toThrow(/was answered 404/u);
  });

  it("gives the runtime each application location in the shape it expects", () => {
    join([{ entry: "https://app1.example.test/remoteEntry.js", name: "remote" }]);

    expect(registered.at(-1)).toStrictEqual([
      { entry: "https://app1.example.test/remoteEntry.js", name: "remote", type: "module" },
    ]);
  });

  it("gives the runtime nothing when the deployment named nothing", () => {
    join([]);

    expect(registered.at(-1)).toStrictEqual([]);
  });
});
