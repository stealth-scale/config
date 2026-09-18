import { describe, expect, it } from "vitest";

import { type Layer } from "@stealthscale/vite-config-core";

import { workspace } from "#workspace.ts";

function fieldOf(layer: Layer | undefined, field: "at" | "item"): unknown {
  return layer !== undefined && field in layer ? Reflect.get(layer, field) : undefined;
}

describe("workspace", () => {
  it("states five layers for the specimens below the root", () => {
    expect(workspace()).toHaveLength(5);
  });

  it("names every layer under this package", () => {
    expect(workspace().every((layer) => layer.name.startsWith("specimen."))).toBe(true);
  });

  it("names each layer for what it states", () => {
    expect(workspace().map((layer) => layer.name)).toStrictEqual([
      "specimen.uncounted(**/*.specimen.tsx)",
      "specimen.exported",
      "specimen.undocumented",
      "specimen.described",
      "specimen.composed",
    ]);
  });

  it("stops the root run counting a specimen it lints", () => {
    expect(fieldOf(workspace()[0], "at")).toBe("test.coverage.exclude");
  });

  it("states why every layer exists", () => {
    expect(workspace().every((layer) => "because" in layer && layer.because !== "")).toBe(true);
  });

  it("covers any specimen in the workspace when no files are named", () => {
    expect(fieldOf(workspace()[0], "item")).toBe("**/*.specimen.tsx");
  });

  it("covers the files a caller names instead", () => {
    expect(fieldOf(workspace(["components/**/*.specimen.tsx"])[0], "item")).toBe(
      "components/**/*.specimen.tsx",
    );
  });
});
