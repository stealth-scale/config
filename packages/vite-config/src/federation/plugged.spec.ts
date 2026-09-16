import { describe, expect, it } from "vitest";

import { type Loaded, plugged } from "#federation/plugged.ts";

/**
 * The least a host can state, which is a name and nothing to fetch.
 */
const STATED = { filename: "remoteEntry.js", name: "shell", remotes: {} };

/**
 * Stands in for the package, answering what it was handed rather than a bundler plugin.
 *
 * What the real plugin builds is its own contract. What this module owes a caller is that the
 * options reach it and the plugin comes back, which is what reading the answer proves.
 *
 * @returns The package, as far as this module reads it.
 */
function loading(): Promise<Loaded> {
  return Promise.resolve({
    federation: (options: unknown) => ({ name: "federation", options }),
  } as unknown as Loaded);
}

/**
 * Stands in for a package whose plugin refuses the options it was handed.
 *
 * @returns The package, whose plugin throws when it is built.
 */
function refusing(): Promise<Loaded> {
  return Promise.resolve({
    federation: () => {
      throw new Error("remotes must be an object");
    },
  } as unknown as Loaded);
}

describe("plugged", () => {
  it("passes the options to the plugin and returns what it built", async () => {
    const held = (await plugged(STATED, loading)) as unknown as {
      name: string;
      options: typeof STATED;
    };

    expect(held.name).toBe("federation");
    expect(held.options).toStrictEqual(STATED);
  });

  it("throws naming what to install when the package cannot be resolved", async () => {
    await expect(plugged(STATED, () => Promise.reject(new Error("not installed")))).rejects.toThrow(
      /@module-federation\/vite installed/u,
    );
  });

  it("resolves the real package when it is given no loader", async () => {
    await expect(plugged(STATED)).resolves.toBeDefined();
  });

  it("rethrows the plugin's own error rather than reporting a missing install", async () => {
    await expect(plugged(STATED, refusing)).rejects.toThrow("remotes must be an object");
  });
});
