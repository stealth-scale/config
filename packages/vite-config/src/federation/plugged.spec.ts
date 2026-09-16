import { describe, expect, it } from "vitest";

import { type Loaded, plugged } from "#federation/plugged.ts";

const STATED = { filename: "remoteEntry.js", name: "shell", remotes: {} };

function loading(): Promise<Loaded> {
  return Promise.resolve({
    federation: (options: unknown) => ({ name: "federation", options }),
  } as unknown as Loaded);
}

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
