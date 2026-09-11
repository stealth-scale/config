import { expect, test } from "vite-plus/test";

import { contribute, preset } from "#layer.ts";
import { merged, NOTHING, replaced } from "#merge.ts";

/**
 * One layer, since only its name and kind are read into the record.
 */
const BASE = preset({ config: {}, name: "base" });

test("starts from nothing composed and nothing recorded", () => {
  expect(NOTHING).toEqual({ config: {}, sources: [] });
});

test("merges a layer's config in", () => {
  expect(merged(NOTHING, { mode: "test" }, BASE).config).toEqual({ mode: "test" });
});

test("merges into what is already there rather than replacing it", () => {
  const first = merged(NOTHING, { run: { cache: true } }, BASE);

  expect(merged(first, { mode: "test" }, BASE).config).toEqual({
    mode: "test",
    run: { cache: true },
  });
});

test("records the layer that decided each value", () => {
  const held = merged(NOTHING, { mode: "test" }, BASE);

  expect(held.sources).toEqual([{ at: "mode", because: undefined, kind: "preset", name: "base" }]);
});

test("records a reason where the layer states one", () => {
  const layer = contribute({ at: "x", because: "a reason", item: 1, name: "one" });

  expect(merged(NOTHING, { mode: "test" }, layer).sources[0]?.because).toBe("a reason");
});

test("keeps the record of every layer before it", () => {
  const first = merged(NOTHING, { mode: "test" }, BASE);
  const second = merged(first, { publicDir: "held" }, preset({ config: {}, name: "other" }));

  expect(second.sources.map((one) => one.name)).toEqual(["base", "other"]);
});

test("records nothing for a layer that changed nothing", () => {
  const first = merged(NOTHING, { mode: "test" }, BASE);

  expect(merged(first, {}, BASE).sources).toHaveLength(1);
});

test("swaps the config wholesale, for a layer handed the whole of it", () => {
  const first = merged(NOTHING, { mode: "test", run: { cache: true } }, BASE);
  const held = replaced(first, { publicDir: "held" }, BASE);

  expect(held.config).toEqual({ publicDir: "held" });
});

test("records what a swap changed", () => {
  const first = merged(NOTHING, { mode: "test" }, BASE);
  const held = replaced(first, { mode: "other" }, preset({ config: {}, name: "late" }));

  expect(held.sources.at(-1)).toMatchObject({ at: "mode", name: "late" });
});
