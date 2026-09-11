import { expect, test } from "vite-plus/test";

import { PALETTE, stylesheet, TOKEN_EXPORTS } from "#palette.ts";

test("writes every token it defines, so the stylesheet and the module agree", () => {
  for (const token of Object.keys(PALETTE)) {
    expect(stylesheet()).toContain(token);
  }
});

test("writes them where a browser reads a custom property from", () => {
  expect(stylesheet().startsWith(":root {")).toBe(true);
});

test("writes the colour beside the token", () => {
  expect(stylesheet()).toContain("--ink: #1a1a1a;");
});

test("names the stylesheet it writes, so the config need not name it a second time", () => {
  expect(Object.values(TOKEN_EXPORTS)).toContain("./dist/tokens.css");
});
