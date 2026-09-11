import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { entry } from "#pack/entry.ts";

test("publishes the entry points it was given", () => {
  const held = (entry(["src/index.ts", "src/preset/web.ts"]).config as UserConfig).pack as {
    entry: string[];
  };

  expect(held.entry).toEqual(["src/index.ts", "src/preset/web.ts"]);
});

test("names them, so a package changing its shape can take the layer back", () => {
  expect(entry(["src/index.ts"]).name).toBe("pack.entry(src/index.ts)");
});
