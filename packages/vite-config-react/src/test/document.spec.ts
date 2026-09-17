/**
 * Checks which document implementation the runner is given, and under which layer name.
 */

import { type UserConfig } from "vite";
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
