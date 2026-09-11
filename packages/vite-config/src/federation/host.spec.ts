import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

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

test("appends to the plugin list rather than replacing whatever else is there", () => {
  expect(plugged({ name: "one", remotes: [] }).at).toBe("plugins");
});

test("carries the plugins the bundler resolves the remotes through", async () => {
  await expect(plugged({ name: "one", remotes: ["two"] }).itemOf?.(told())).resolves.toBeDefined();
});

test("says why, which is that these modules come from another deployment", () => {
  expect(plugged({ name: "one", remotes: [] }).because).toContain("another deployment");
});

test("names the host, so a repository loading nothing can take the layer back", () => {
  expect(plugged({ name: "shell", remotes: [] }).name).toBe("federation.host(shell)");
});

test("takes a shared list, the host being the side that decides what a singleton is", async () => {
  await expect(
    plugged({ name: "one", remotes: ["two"], shared: { react: { singleton: true } } }).itemOf?.(
      told(),
    ),
  ).resolves.toBeDefined();
});

test("takes no remotes at all, which is how one build reaches more than one environment", async () => {
  await expect(plugged({ name: "one" }).itemOf?.(told())).resolves.toBeDefined();
});

test("states nothing for the runner where a repository named no stand-ins", () => {
  expect(host({ name: "one", remotes: [] })).toHaveLength(1);
});

test("points the runner at a stand-in for each name imported from a remote", () => {
  const [, held] = host({ name: "one", stubs: { "remote/Thing": "/abs/thing.tsx" } });

  expect(((held as Preset).config as UserConfig).test?.alias).toEqual({
    "remote/Thing": "/abs/thing.tsx",
  });
});

test("names that layer apart, so a repository testing against a real remote can take it back", () => {
  const [, held] = host({ name: "one", stubs: { "remote/Thing": "/abs/thing.tsx" } });

  expect(held?.name).toBe("federation.host(one).stubs");
});
