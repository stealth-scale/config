/**
 * Checks each React rule the layer declares, and that none of them is set to off.
 */

import { describe, expect, it } from "vitest";

import { rules } from "#lint/rules.ts";

/**
 * Unwraps the rule map the layer declares.
 */
function stated(): Record<string, unknown> {
  const held = rules().item as { rules: Record<string, unknown> };

  return held.rules;
}

describe("rules", () => {
  it("allows JSX in a TypeScript file", () => {
    expect(stated()["react/jsx-filename-extension"]).toStrictEqual([
      "error",
      { extensions: [".jsx", ".tsx"] },
    ]);
  });

  it("rejects markup assigned as a string", () => {
    expect(stated()["react/no-danger"]).toBe("error");
  });

  it("limits a file to one component", () => {
    expect(stated()["react/no-multi-comp"]).toBe("error");
  });

  it("keeps a file refreshable by refusing an export beside the component", () => {
    expect(stated()["react/only-export-components"]).toBe("error");
  });

  it("asks more of the file and names the layer for the call a consumer wrote", () => {
    expect(rules().name).toBe("react.lint.rules");

    for (const held of Object.values(stated())) expect(held).not.toBe("off");
  });
});
