import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { type Resolving, setupIn } from "#setup.ts";

const FOUNDATION = "@acme/foundation";

function reading(root: string): Resolving {
  return {
    resolve: (specifier) => join(root, specifier.replace(`${FOUNDATION}/`, "")),
  };
}

describe("setupIn", () => {
  it("answers with the source a workspace holds before anything is built", () => {
    const held = withScratchWorkspace({ "src/testing.ts": "" }, (scratch) => ({
      found: setupIn(reading(scratch.root), FOUNDATION),
      want: scratch.path("src/testing.ts"),
    }));

    expect(held.found).toBe(held.want);
  });

  it("answers with the published file where an installed copy holds no source", () => {
    const held = withScratchWorkspace({ "dist/testing.js": "" }, (scratch) => ({
      found: setupIn(reading(scratch.root), FOUNDATION),
      want: scratch.path("testing"),
    }));

    expect(held.found).toBe(held.want);
  });

  it("finds the foundation through its manifest rather than its entry point", () => {
    const seen: string[] = [];
    const held = withScratchWorkspace({ "src/testing.ts": "" }, (scratch) => {
      const watched: Resolving = {
        resolve: (specifier) => {
          seen.push(specifier);

          return join(scratch.root, specifier.replace(`${FOUNDATION}/`, ""));
        },
      };

      return setupIn(watched, FOUNDATION);
    });

    expect(seen).toStrictEqual([`${FOUNDATION}/package.json`]);
    expect(held).toContain("testing.ts");
  });
});
