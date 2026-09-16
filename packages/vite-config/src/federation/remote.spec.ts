import { describe, expect, it } from "vitest";

import { remote } from "#federation/remote.ts";
import { told } from "#vite.fixtures.ts";

describe("remote", () => {
  it("appends to the plugin list rather than replacing whatever else is there", () => {
    expect(remote({ exposes: {}, name: "one" }).at).toBe("plugins");
  });

  it("adds the plugins the bundler builds the entry from", async () => {
    await expect(
      remote({ exposes: { "./A": "./src/a.ts" }, name: "one" }).itemOf?.(told()),
    ).resolves.toBeDefined();
  });

  it("gives a reason that tells a remote from a published package", () => {
    expect(remote({ exposes: {}, name: "one" }).because).toContain("run time");
  });

  it("names the remote", () => {
    expect(remote({ exposes: {}, name: "dashboards" }).name).toBe("federation.remote(dashboards)");
  });

  it("takes a shared list", async () => {
    const held = remote({ exposes: {}, name: "one", shared: { react: { singleton: true } } });

    await expect(held.itemOf?.(told())).resolves.toBeDefined();
  });
});
