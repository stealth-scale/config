import { describe, expect, it } from "vitest";

import { fragments } from "#fragments.ts";

function cut(text: string): Record<string, string> {
  return fragments({ path: "/src/badge/badge.specimen.tsx", text });
}

const SCENE = [
  'import { Matrix, specimen } from "@stealthscale/specimen";',
  'import { Badge } from "#badge/index.ts";',
  'import { Unused } from "#badge/unused.ts";',
  "",
  'const SIZES = ["sm", "md"];',
  "",
  "const SPARE = 1;",
  "",
  "export const sizes = {",
  "  draw: () => <Matrix of={SIZES}>{(size) => <Badge size={size} />}</Matrix>,",
  '  title: "Sizes",',
  "};",
  "",
  'export default specimen({ id: "data/badge", scenes: [sizes] });',
  "",
].join("\n");

describe("fragments", () => {
  it("keys a snippet by the scene's title", () => {
    expect(Object.keys(cut(SCENE))).toStrictEqual(["Sizes"]);
  });

  it("includes the scene's own declaration", () => {
    expect(cut(SCENE)["Sizes"]).toMatch(/export const sizes = \{/u);
  });

  it("includes a declaration the scene references", () => {
    expect(cut(SCENE)["Sizes"]).toMatch(/const SIZES/u);
  });

  it("omits a declaration the scene does not reference", () => {
    expect(cut(SCENE)["Sizes"]).not.toMatch(/SPARE/u);
  });

  it("includes only the specifiers the scene uses", () => {
    expect(cut(SCENE)["Sizes"]).toMatch(/import \{ Matrix \} from "@stealthscale\/specimen";/u);
  });

  it("omits an import the scene uses nothing from", () => {
    expect(cut(SCENE)["Sizes"]).not.toMatch(/Unused/u);
  });

  it("writes the imports before the declarations", () => {
    const snippet = cut(SCENE)["Sizes"] ?? "";

    expect(snippet.indexOf("import")).toBeLessThan(snippet.indexOf("const SIZES"));
  });

  it("includes a scene written inline in the scenes array", () => {
    const held = cut(
      'export default specimen({ id: "a", scenes: [{ draw: () => null, title: "Inline" }] });\n',
    );

    expect(held["Inline"]).toMatch(/draw: \(\) => null/u);
  });

  it("skips a scene whose title is not a string literal", () => {
    const held = cut(
      'const name = "A";\nexport default specimen({ id: "a", scenes: [{ draw: () => null, title: name }] });\n',
    );

    expect(held).toStrictEqual({});
  });

  it("skips an element that names nothing the file declares", () => {
    expect(cut('export default specimen({ id: "a", scenes: [absent] });\n')).toStrictEqual({});
  });

  it("skips an element that is neither a name nor an object", () => {
    expect(cut('export default specimen({ id: "a", scenes: ["Sizes"] });\n')).toStrictEqual({});
  });

  it("returns an empty record when the scenes property is not an array", () => {
    expect(cut('export default specimen({ id: "a", scenes: listed });\n')).toStrictEqual({});
  });

  it("returns an empty record when the page declares no scenes", () => {
    expect(cut('export default specimen({ id: "a" });\n')).toStrictEqual({});
  });

  it("returns an empty record when the file declares no page", () => {
    expect(cut("export const a = 1;\n")).toStrictEqual({});
  });

  it("returns an empty record when the file does not parse", () => {
    expect(cut("export default specimen(")).toStrictEqual({});
  });

  it("follows a declaration the scene reaches through another", () => {
    const held = cut(
      [
        "const DEEP = 1;",
        "const NEAR = DEEP;",
        'export const one = { draw: () => NEAR, title: "One" };',
        'export default specimen({ id: "a", scenes: [one] });',
        "",
      ].join("\n"),
    );

    expect(held["One"]).toMatch(/const DEEP/u);
  });
});
