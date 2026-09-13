import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { chunks } from "#build/chunks.ts";

/**
 * Describes one group as the layer states it.
 */
interface Group {
  entriesAware?: boolean;
  name: string;
  priority?: number;
  tags: readonly string[];
  test?: RegExp;
}

/**
 * Reads the splitting the layer states.
 *
 * @returns The groups, and whatever is set beside them.
 */
function splitting(): { groups: readonly Group[]; includeDependenciesRecursively?: boolean } {
  const output = (chunks().config as UserConfig).build?.rolldownOptions?.output as {
    codeSplitting: { groups: readonly Group[]; includeDependenciesRecursively?: boolean };
  };

  return output.codeSplitting;
}

/**
 * Finds which group a module at a path lands in, the way the bundler tries them: by priority.
 *
 * @param path - Where the module is.
 * @returns The group's name.
 */
function landing(path: string): string | undefined {
  return splitting()
    .groups.toSorted((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .find((group) => group.test === undefined || group.test.test(path))?.name;
}

test("writes the React runtime, the other packages and the application to a chunk each", () => {
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

test("takes only what the entry reaches statically, leaving a lazy route a chunk of its own", () => {
  for (const group of splitting().groups) {
    expect(group.tags).toEqual(["$initial"]);
  }
});

test("does not group per entry, which would count every lazy chunk as one", () => {
  for (const group of splitting().groups) {
    expect(group.entriesAware).toBeUndefined();
  }
  expect(splitting().includeDependenciesRecursively).toBeUndefined();
});

test("names itself, so an application that splits its own can take the layer back", () => {
  expect(chunks().name).toBe("build.chunks");
});
