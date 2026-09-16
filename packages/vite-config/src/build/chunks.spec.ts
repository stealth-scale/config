import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { chunks } from "#build/chunks.ts";

interface Group {
  entriesAware?: boolean;
  name: string;
  priority?: number;
  tags: readonly string[];
  test?: RegExp;
}

function splitting(): { groups: readonly Group[]; includeDependenciesRecursively?: boolean } {
  const output = (chunks().config as UserConfig).build?.rolldownOptions?.output as {
    codeSplitting: { groups: readonly Group[]; includeDependenciesRecursively?: boolean };
  };

  return output.codeSplitting;
}

function landing(path: string): string | undefined {
  return splitting()
    .groups.toSorted((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .find((group) => group.test === undefined || group.test.test(path))?.name;
}

describe("chunks", () => {
  it("splits the runtime the dependencies and the application into a chunk each", () => {
    expect(landing("/r/node_modules/.pnpm/react-dom@19/node_modules/react-dom/index.js")).toBe(
      "framework",
    );
    expect(landing("/r/node_modules/.pnpm/react@19/node_modules/react/jsx-runtime.js")).toBe(
      "framework",
    );
    expect(landing("/r/node_modules/.pnpm/scheduler@0.27/node_modules/scheduler/index.js")).toBe(
      "framework",
    );
    expect(
      landing("/r/node_modules/.pnpm/@chakra-ui+react@3/node_modules/@chakra-ui/react/x.js"),
    ).toBe("vendor");
    expect(landing("/r/apps/docs/src/main.tsx")).toBe("app");
    expect(landing("/r/components/controls/src/index.ts")).toBe("app");
  });

  it("takes only what the entry reaches statically", () => {
    for (const group of splitting().groups) {
      expect(group.tags).toStrictEqual(["$initial"]);
    }
  });

  it("groups nothing per entry", () => {
    for (const group of splitting().groups) {
      expect(group.entriesAware).toBeUndefined();
    }

    expect(splitting().includeDependenciesRecursively).toBeUndefined();
  });

  it("names the layer so a repository can remove it", () => {
    expect(chunks().name).toBe("build.chunks");
  });
});
