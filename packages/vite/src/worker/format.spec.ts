import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { format } from "#worker/format.ts";

test("bundles a worker as a module, so it shares chunks with the page rather than inlining them", () => {
  expect((format().config as UserConfig).worker?.format).toBe("es");
});

test("names itself, so a repository reaching an older browser can take the layer back", () => {
  expect(format().name).toBe("worker.format");
});
