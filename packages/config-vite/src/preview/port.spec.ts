import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { port } from "#preview/port.ts";

test("serves the build at the port it was given", () => {
  expect((port(4300).config as UserConfig).preview?.port).toBe(4300);
});

test("refuses to move off it, whatever was pointed at it reaching this and not another", () => {
  expect((port(4300).config as UserConfig).preview?.strictPort).toBe(true);
});

test("leaves the dev server alone, an application being previewed while it is served", () => {
  expect((port(4300).config as UserConfig).server).toBeUndefined();
});

test("names the port, so a config says which server was pinned where", () => {
  expect(port(4300).name).toBe("preview.port(4300)");
});
