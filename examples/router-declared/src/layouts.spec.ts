import { describe, expect, it } from "vitest";

import { LAYOUTS } from "#layouts.ts";
import { Sales } from "#sales.tsx";

describe("LAYOUTS", () => {
  it("names the frame a declaration asks for by string", () => {
    expect(LAYOUTS["sales"]).toBe(Sales);
  });

  it("names nothing else", () => {
    expect(Object.keys(LAYOUTS)).toStrictEqual(["sales"]);
  });
});
