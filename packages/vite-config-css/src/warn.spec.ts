import { describe, expect, it } from "vitest";

import { warn } from "#warn.ts";

describe("warn", () => {
  it("removes the check by name before adding another", () => {
    const held = warn({ because: "adopting the rules" });

    expect(held[0]?.kind).toBe("removal");
    expect(held[0]).toHaveProperty("target", "css.check");
  });

  it("names the layer for the call a consumer wrote and keeps the reason", () => {
    const held = warn({ because: "adopting the rules" });

    expect(held[0]?.name).toBe("css.warn");
    expect(held[0]).toHaveProperty("because", "adopting the rules");
  });

  it("adds a check back under its own name", () => {
    const held = warn({ because: "adopting the rules" })[1];

    expect(held?.kind).toBe("contribution");
    expect(held?.name).toBe("css.warn");
  });

  it("keeps whatever else was configured", () => {
    const held = warn({ because: "adopting the rules", rules: { "color-no-hex": true } });

    expect(held).toHaveLength(2);
  });
});
