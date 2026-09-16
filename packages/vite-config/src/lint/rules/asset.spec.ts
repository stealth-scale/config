/**
 * Specifies which unassigned imports the asset group allows and which it refuses.
 */

import { describe, expect, it } from "vitest";

import { ASSET } from "#lint/rules/asset.ts";
import { base, web } from "#lint/rules/index.ts";

describe("asset", () => {
  it("lets a stylesheet be imported for its own sake", () => {
    const held = ASSET["no-unassigned-import"] as [string, { allow: string[] }];

    expect(held[1].allow).toContain("**/*.css");
  });

  it("still catches a module imported and never read", () => {
    const held = ASSET["no-unassigned-import"] as [string, { allow: string[] }];

    expect(held[0]).toBe("error");
  });

  it("applies in every tier", () => {
    expect(Object.keys(base())).toContain("no-unassigned-import");
    expect(Object.keys(web())).toContain("no-unassigned-import");
  });
});
