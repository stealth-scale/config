import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { manifests } from "#fmt/manifests.ts";

test("sorts a manifest into the conventional order rather than the order it was typed", () => {
  expect((manifests().config as UserConfig).fmt?.sortPackageJson).toBe(true);
});

test("states it rather than inheriting it, since it rewrites a published contract", () => {
  expect((manifests().config as UserConfig).fmt).toHaveProperty("sortPackageJson");
});
