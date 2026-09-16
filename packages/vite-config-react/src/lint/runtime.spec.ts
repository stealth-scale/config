/**
 * Checks the relaxation against the tsconfig setting that justifies it.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { runtime } from "#lint/runtime.ts";

/**
 * Reads the compiler options out of the tsconfig fragment this package publishes.
 */
function shipped(): Record<string, unknown> {
  const source = readFileSync(new URL("../../web.json", import.meta.url).pathname, "utf8");
  const held = JSON.parse(source) as { compilerOptions: Record<string, unknown> };

  return held.compilerOptions;
}

describe("runtime", () => {
  it("stops asking for React in scope", () => {
    const held = runtime().item as { rules: Record<string, unknown> };

    expect(held.rules["react/react-in-jsx-scope"]).toBe("off");
  });

  it("matches the tsconfig that makes it obsolete", () => {
    expect(shipped()["jsx"]).toBe("react-jsx");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(runtime().name).toBe("react.lint.runtime");
  });
});
