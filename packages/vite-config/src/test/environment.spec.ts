import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { environment } from "#test/environment.ts";

describe("environment", () => {
  it("runs inside the environment it was given", () => {
    expect((environment("happy-dom").config as UserConfig).test?.environment).toBe("happy-dom");
  });

  it("names the environment", () => {
    expect(environment("jsdom").name).toBe("test.environment(jsdom)");
  });
});
