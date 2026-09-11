import { expect, test } from "vite-plus/test";

import { type Runs, type Staging } from "#staged/settings.ts";

test("takes a rule written as nothing but its command", () => {
  const held: Runs = "vp check --fix";

  expect(held).toBe("vp check --fix");
});

test("takes several commands, which run in the order they were written", () => {
  const held: Runs = ["vp fmt", "vp check"];

  expect(held).toHaveLength(2);
});

test("holds each glob against what runs on the staged files matching it", () => {
  const held: Staging = { "*.ts": "vp check --fix" };

  expect(Object.keys(held)).toEqual(["*.ts"]);
});
