import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Menu } from "@stealthscale/component-disclosure";

import { Action } from "#switcher/action.ts";
import { Content } from "#switcher/content.ts";
import { Root } from "#switcher/root.ts";
import { Trigger } from "#switcher/trigger.tsx";

describe("Action", () => {
  it("draws a row that does something other than switch", () => {
    render(
      <Root open>
        <Trigger label="Workspace">Acme</Trigger>
        <Menu.Positioner>
          <Content>
            <Action value="new">New workspace</Action>
          </Content>
        </Menu.Positioner>
      </Root>,
    );

    expect(screen.getByRole("menuitem", { name: "New workspace" })).toBeTruthy();
  });

  it("carries no tick, none of these being the current one", () => {
    render(
      <Root open>
        <Trigger label="Workspace">Acme</Trigger>
        <Menu.Positioner>
          <Content>
            <Action value="new">New workspace</Action>
          </Content>
        </Menu.Positioner>
      </Root>,
    );

    expect(screen.queryByRole("menuitemradio")).toBeNull();
  });
});
