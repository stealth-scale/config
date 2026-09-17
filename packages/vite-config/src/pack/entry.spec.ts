import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { entry } from "#pack/entry.ts";

describe("entry", () => {
  it("publishes the entry points it was given", () => {
    const held = (entry(["src/index.ts", "src/preset/web.ts"]).config as UserConfig).pack as {
      entry: string[];
    };

    expect(held.entry).toStrictEqual(["src/index.ts", "src/preset/web.ts"]);
  });

  it("names them", () => {
    expect(entry(["src/index.ts"]).name).toBe("pack.entry(src/index.ts)");
  });
});
