import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { format } from "#worker/format.ts";

describe("format", () => {
  it("bundles a worker as a module", () => {
    expect((format().config as UserConfig).worker?.format).toBe("es");
  });

  it("names the layer so a repository can remove it", () => {
    expect(format().name).toBe("worker.format");
  });
});
