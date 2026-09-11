import { expect, test } from "vite-plus/test";

import { remote } from "#federation/remote.ts";
import { told } from "#vite.fixtures.ts";

test("appends to the plugin list rather than replacing whatever else is there", () => {
  expect(remote({ exposes: {}, name: "one" }).at).toBe("plugins");
});

test("carries the plugins the bundler builds the entry from", async () => {
  await expect(
    remote({ exposes: { "./A": "./src/a.ts" }, name: "one" }).itemOf?.(told()),
  ).resolves.toBeDefined();
});

test("says why, which is what tells a remote apart from a published package", () => {
  expect(remote({ exposes: {}, name: "one" }).because).toContain("run time");
});

test("names the remote, so a repository exposing nothing can take the layer back", () => {
  expect(remote({ exposes: {}, name: "dashboards" }).name).toBe("federation.remote(dashboards)");
});

test("takes a shared list, which is how it avoids bringing a second React", async () => {
  const held = remote({ exposes: {}, name: "one", shared: { react: { singleton: true } } });

  await expect(held.itemOf?.(told())).resolves.toBeDefined();
});
