import { describe, expect, it } from "vitest";

import { uncounted } from "#uncounted.ts";

describe("uncounted", () => {
  it("stops counting one set of files by default", () => {
    expect(uncounted()).toHaveLength(1);
  });

  it("names the layer for this package rather than for the call that built it", () => {
    expect(uncounted()[0]?.name).toBe("specimen.uncounted(**/*.specimen.tsx)");
  });

  it("appends the glob to the globs coverage does not count", () => {
    expect(uncounted()[0]?.at).toBe("test.coverage.exclude");
  });

  it("stops counting any specimen in the package when no files are named", () => {
    expect(uncounted()[0]?.item).toBe("**/*.specimen.tsx");
  });

  it("stops counting the files a caller names instead", () => {
    expect(uncounted(["src/pages/**/*.specimen.tsx"])[0]?.item).toBe("src/pages/**/*.specimen.tsx");
  });

  it("contributes one layer per glob", () => {
    expect(uncounted(["a/*.specimen.tsx", "b/*.specimen.tsx"])).toHaveLength(2);
  });

  it("states why every layer exists", () => {
    expect(uncounted().every((layer) => layer.because !== "")).toBe(true);
  });
});
