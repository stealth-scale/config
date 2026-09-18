import { describe, expect, it } from "vitest";

import { Cell } from "#cell.tsx";
import { Group } from "#group.tsx";
import { Item } from "#item.tsx";
import { layouts } from "#layouts.ts";
import { Step } from "#step.tsx";

describe("layouts", () => {
  it("names the four components that lay a generated form out", () => {
    expect(layouts).toStrictEqual({ Cell, Group, Item, Step });
  });
});
