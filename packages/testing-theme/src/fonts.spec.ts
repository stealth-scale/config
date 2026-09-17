import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { installed } from "#fonts.ts";
import { paletteTheme } from "#theme.fixtures.ts";

const AT = join(import.meta.dirname, "..");

describe("installed", () => {
  it("reports nothing for a package that resolves from the directory", () => {
    expect(installed({ ...paletteTheme(), fonts: ["vitest"] }, AT)).toStrictEqual([]);
  });

  it("reports a package that does not resolve from the directory", () => {
    expect(installed({ ...paletteTheme(), fonts: ["@nope/face"] }, AT)).toStrictEqual([
      `audited names @nope/face, which does not resolve from ${AT}`,
    ]);
  });

  it("resolves from the working directory when no directory is given", () => {
    const cwd = vi.spyOn(process, "cwd").mockReturnValue(AT);
    const found = installed({ ...paletteTheme(), fonts: ["vitest"] });

    cwd.mockRestore();

    expect(found).toStrictEqual([]);
  });

  it("reports nothing for a theme that names no font package", () => {
    expect(installed(paletteTheme(), AT)).toStrictEqual([]);
  });
});
