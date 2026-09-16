import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { type Contribution, type Preset } from "@stealthscale/vite-config";

import { host, type Hosted } from "#federation/host.ts";
import { told } from "#vite.fixtures.ts";

/**
 * Reads back the layer that carries the plugins.
 *
 * @param stated - What the host was told.
 * @returns The contribution.
 */
function plugged(stated: Hosted): Contribution {
  return host(stated)[0] as Contribution;
}

describe("host", () => {
  it("appends to the plugin list rather than replacing whatever else is there", () => {
    expect(plugged({ name: "one", remotes: [] }).at).toBe("plugins");
  });

  it("adds the plugins the bundler resolves the remotes through", async () => {
    await expect(
      plugged({ name: "one", remotes: ["two"] }).itemOf?.(told()),
    ).resolves.toBeDefined();
  });

  it("gives a reason naming the other deployment", () => {
    expect(plugged({ name: "one", remotes: [] }).because).toContain("another deployment");
  });

  it("names the host", () => {
    expect(plugged({ name: "shell", remotes: [] }).name).toBe("federation.host(shell)");
  });

  it("takes a shared list", async () => {
    await expect(
      plugged({ name: "one", remotes: ["two"], shared: { react: { singleton: true } } }).itemOf?.(
        told(),
      ),
    ).resolves.toBeDefined();
  });

  it("takes no remotes at all", async () => {
    await expect(plugged({ name: "one" }).itemOf?.(told())).resolves.toBeDefined();
  });

  it("configures nothing for the runner when a repository named no stand-ins", () => {
    expect(host({ name: "one", remotes: [] })).toHaveLength(1);
  });

  it("points the runner at a stand-in for each name imported from a remote", () => {
    const [, held] = host({ name: "one", stubs: { "remote/Thing": "/abs/thing.tsx" } });

    expect(((held as Preset).config as UserConfig).test?.alias).toStrictEqual({
      "remote/Thing": "/abs/thing.tsx",
    });
  });

  it("names the stand-in layer separately", () => {
    const [, held] = host({ name: "one", stubs: { "remote/Thing": "/abs/thing.tsx" } });

    expect(held?.name).toBe("federation.host(one).stubs");
  });
});
