import { expect, test } from "vite-plus/test";

import { ASSET } from "#lint/rules/asset.ts";
import { base, web } from "#lint/rules/index.ts";

test("lets a stylesheet be imported for its own sake, since it exports nothing to assign", () => {
  const held = ASSET["no-unassigned-import"] as [string, { allow: string[] }];

  expect(held[1].allow).toContain("**/*.css");
});

test("still catches a module imported and never read, which is the ordinary case", () => {
  const held = ASSET["no-unassigned-import"] as [string, { allow: string[] }];

  expect(held[0]).toBe("error");
});

test("is held by every tier, since a rule only the browser's reaches never fires in a workspace", () => {
  expect(Object.keys(base())).toContain("no-unassigned-import");
  expect(Object.keys(web())).toContain("no-unassigned-import");
});
