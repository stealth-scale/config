import { describe, expect, it } from "vitest";

import { bundle } from "#ssr/bundle.ts";

describe("bundle", () => {
  it("appends to the list rather than replacing what the builder worked out", () => {
    for (const held of bundle({ because: "why", deps: ["@acme/ui"] })) {
      expect(held.at).toBe("ssr.noExternal");
    }
  });

  it("makes one contribution per package", () => {
    const held = bundle({ because: "why", deps: ["one", "two"] });

    expect(held.map((each) => each.name)).toStrictEqual(["ssr.bundle(one)", "ssr.bundle(two)"]);
  });

  it("names the package", () => {
    const [held] = bundle({ because: "why", deps: ["@acme/ui"] });

    expect(held?.item).toBe("@acme/ui");
  });

  it("keeps the reason node cannot load it", () => {
    const [held] = bundle({ because: "it imports a stylesheet", deps: ["@acme/ui"] });

    expect(held?.because).toBe("it imports a stylesheet");
  });

  it("contributes nothing when given nothing", () => {
    expect(bundle({ because: "why", deps: [] })).toStrictEqual([]);
  });
});
