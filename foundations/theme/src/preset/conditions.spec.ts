import { describe, expect, it } from "vitest";

import { COLOR_MODE_ATTRIBUTE, conditions } from "#preset/conditions.ts";

describe("conditions", () => {
  it("adds to the compiler's conditions rather than replacing them", () => {
    expect(Object.keys(conditions)).toStrictEqual(["extend"]);
  });

  it("reads the color mode from the attribute", () => {
    expect(COLOR_MODE_ATTRIBUTE).toBe("data-color-mode");
    expect(conditions.extend?.["dark"]).toBe("[data-color-mode=dark] &");
  });

  it("draws light as the complement of dark", () => {
    expect(conditions.extend?.["light"]).toBe(
      "&:not([data-color-mode=dark], [data-color-mode=dark] *)",
    );
  });

  it("holds hover inside a media query and excludes a disabled control", () => {
    expect(conditions.extend?.["hover"]).toStrictEqual({
      "@media (hover: hover)": {
        "&:is(:hover, [data-hover]):not(:disabled, [data-disabled], [aria-disabled=true])": "@slot",
      },
    });
  });

  it("excludes a disabled control and an open trigger from active", () => {
    expect(conditions.extend?.["active"]).toBe(
      "&:is(:active, [data-active]):not(:disabled, [data-disabled], [aria-disabled=true], [data-state=open])",
    );
  });

  it("waits for the reader before a field reads as invalid", () => {
    expect(conditions.extend?.["invalid"]).toContain(":user-invalid");
  });

  it("names the density and the folded screen as attributes on an ancestor", () => {
    expect(conditions.extend?.["compact"]).toBe("[data-density=compact] &");
    expect(conditions.extend?.["comfortable"]).toBe("[data-density=comfortable] &");
    expect(conditions.extend?.["narrow"]).toBe("[data-narrow] &");
  });

  it("names the pointer and the transparency preference as media queries", () => {
    expect(conditions.extend?.["touch"]).toBe("@media (pointer: coarse)");
    expect(conditions.extend?.["mouse"]).toBe("@media (pointer: fine)");
    expect(conditions.extend?.["reducedTransparency"]).toBe(
      "@media (prefers-reduced-transparency: reduce)",
    );
  });

  it("names a toggle's two states and a pinned row", () => {
    expect(conditions.extend?.["on"]).toBe("&[data-state=on]");
    expect(conditions.extend?.["off"]).toBe("&[data-state=off]");
    expect(conditions.extend?.["pinned"]).toBe("&[data-pinned]");
  });
});
