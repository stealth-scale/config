import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { document } from "#test/document.ts";

test("draws into an implementation that has media queries, which jsdom has never had", () => {
  expect((document().config as UserConfig).test?.environment).toBe("happy-dom");
});

test("names itself, so a repository testing against something else can take it back", () => {
  expect(document().name).toBe("test.environment(happy-dom)");
});
