/**
 * Proves a preview server's allowed origins are copied, and that the
 * environment overrides them.
 */

import { describe, expect, it } from "vitest";

import { shared } from "#preview/shared.ts";
import { answered } from "#vite.fixtures.ts";

/**
 * Reads back the origins a layer permits, under an environment a caller
 * supplies.
 */
async function allowed(
  origins: readonly string[],
  env: Record<string, string> = {},
): Promise<string[]> {
  const held = (await answered(shared(origins), { env })).preview?.cors as { origin: string[] };

  return held.origin;
}

describe("shared", () => {
  it("lets the origins it was given fetch what the preview serves", async () => {
    await expect(allowed(["http://localhost:4200"])).resolves.toStrictEqual([
      "http://localhost:4200",
    ]);
  });

  it("takes more than one origin", async () => {
    await expect(allowed(["http://localhost:4200", "http://localhost:4400"])).resolves.toHaveLength(
      2,
    );
  });

  it("copies the origins it was given", async () => {
    const origins = ["http://localhost:4200"];

    await expect(allowed(origins)).resolves.not.toBe(origins);
  });

  it("takes the environment value instead when a machine has arranged its own", async () => {
    const held = await allowed(["https://stated.example.test"], {
      STEALTH_ORIGINS: "https://override.example.test",
    });

    expect(held).toStrictEqual(["https://override.example.test"]);
  });

  it("names the layer for the origins it was written with", () => {
    expect(shared(["http://localhost:4200"]).name).toBe("preview.shared(http://localhost:4200)");
    expect(shared().name).toBe("preview.shared");
  });
});
