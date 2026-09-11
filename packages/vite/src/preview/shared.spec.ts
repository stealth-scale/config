import { expect, test } from "vite-plus/test";

import { shared } from "#preview/shared.ts";
import { answered } from "#serving/serving.fixtures.ts";

/**
 * Reads back the origins a layer allows.
 *
 * @param origins - The origins stated.
 * @param env - The variables the machine holds.
 * @returns The origins the preview answers.
 */
async function allowed(
  origins: readonly string[],
  env: Record<string, string> = {},
): Promise<string[]> {
  const held = (await answered(shared(origins), env)).preview?.cors as { origin: string[] };

  return held.origin;
}

test("lets the origins it was given fetch what the preview serves", async () => {
  expect(await allowed(["http://localhost:4200"])).toEqual(["http://localhost:4200"]);
});

test("takes more than one, an application loaded by two hosts naming both", async () => {
  expect(await allowed(["http://localhost:4200", "http://localhost:4400"])).toHaveLength(2);
});

test("copies what it was given, so a caller's list is not the server's", async () => {
  const origins = ["http://localhost:4200"];

  expect(await allowed(origins)).not.toBe(origins);
});

test("takes the environment's answer instead, where a machine has arranged its own", async () => {
  const held = await allowed(["https://stated.example.test"], {
    STEALTH_ORIGINS: "https://override.example.test",
  });

  expect(held).toEqual(["https://override.example.test"]);
});

test("is named the same whatever a machine arranged, so a repository can take it back", () => {
  expect(shared(["http://localhost:4200"]).name).toBe("preview.shared");
});
