import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { served } from "#build/served.ts";

test("serves an application's own files from the place it was given", () => {
  expect((served("https://cdn.example.com/remote/").config as UserConfig).base).toBe(
    "https://cdn.example.com/remote/",
  );
});

test("takes a path as readily as an origin, an application mounted under one needing it", () => {
  expect((served("/remote/").config as UserConfig).base).toBe("/remote/");
});

test("names where it serves from, so a config says why a URL is absolute", () => {
  expect(served("/remote/").name).toBe("build.served(/remote/)");
});
