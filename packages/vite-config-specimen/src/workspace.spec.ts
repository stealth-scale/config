import { describe, expect, it } from "vitest";

import { workspace } from "#workspace.ts";

describe("workspace", () => {
  it("states four layers for the specimens below the root", () => {
    expect(workspace()).toHaveLength(4);
  });

  it("names every layer under this package", () => {
    expect(workspace().every((layer) => layer.name.startsWith("specimen."))).toBe(true);
  });

  it("names each layer for what it relaxes", () => {
    expect(workspace().map((layer) => layer.name)).toStrictEqual([
      "specimen.exported",
      "specimen.undocumented",
      "specimen.described",
      "specimen.composed",
    ]);
  });

  it("states why every layer exists", () => {
    expect(workspace().every((layer) => "because" in layer && layer.because !== "")).toBe(true);
  });

  it("covers any specimen in the workspace when no files are named", () => {
    const [first] = workspace();
    const item = first !== undefined && "item" in first ? first.item : undefined;

    expect(JSON.stringify(item)).toMatch(/\*\*\/\*\.specimen\.tsx/u);
  });

  it("covers the files a caller names instead", () => {
    const [first] = workspace(["components/**/*.specimen.tsx"]);
    const item = first !== undefined && "item" in first ? first.item : undefined;

    expect(JSON.stringify(item)).toMatch(/components/u);
  });
});
