import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { declarations } from "#pack/declarations.ts";

test("asks for types rather than leaving the packer to work out whether to emit them", () => {
  const held = (declarations().config as UserConfig).pack as { dts: boolean };

  expect(held.dts).toBe(true);
});

test("names itself, so a package publishing no types can take the layer back", () => {
  expect(declarations().name).toBe("pack.declarations");
});
