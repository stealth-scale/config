import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { base } from "#build/base.ts";

describe("base", () => {
  it("serves an application's own files from the path it was given", () => {
    expect((base("https://cdn.example.com/remote/").config as UserConfig).base).toBe(
      "https://cdn.example.com/remote/",
    );
  });

  it("takes a path as readily as an origin", () => {
    expect((base("/remote/").config as UserConfig).base).toBe("/remote/");
  });

  it("names where it serves from", () => {
    expect(base("/remote/").name).toBe("build.base(/remote/)");
  });
});
