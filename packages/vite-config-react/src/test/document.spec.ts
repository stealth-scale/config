import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { document } from "#test/document.ts";

describe("document", () => {
  it("renders into a document implementation with media queries", () => {
    expect((document().config as UserConfig).test?.environment).toBe("happy-dom");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(document().name).toBe("react.test.document");
  });
});
