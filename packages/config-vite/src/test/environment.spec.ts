import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { environment } from "#test/environment.ts";

test("runs inside the environment it was given", () => {
  expect((environment("happy-dom").config as UserConfig).test?.environment).toBe("happy-dom");
});

test("names the environment, so a package needing the other answer can take it back", () => {
  expect(environment("jsdom").name).toBe("test.environment(jsdom)");
});
