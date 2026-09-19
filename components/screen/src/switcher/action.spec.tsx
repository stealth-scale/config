import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Action } from "#switcher/action.ts";
import { opened } from "#switcher/switcher.fixtures.tsx";

describe("Action", () => {
  it("draws a row that does something other than switch", async () => {
    await drawn(opened(<Action value="new">New workspace</Action>));

    expect(screen.getByRole("menuitem", { name: "New workspace" })).toBeTruthy();
  });

  it("carries no tick, none of these being the current one", async () => {
    await drawn(opened(<Action value="new">New workspace</Action>));

    expect(screen.queryByRole("menuitemradio")).toBeNull();
  });
});
