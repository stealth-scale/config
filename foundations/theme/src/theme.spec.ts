import { describe, expect, it } from "vitest";

import { foundation } from "#preset/index.ts";
import published from "#theme.ts";

describe("theme", () => {
  it("publishes the foundation as its default export", () => {
    expect(published).toBe(foundation);
  });
});
