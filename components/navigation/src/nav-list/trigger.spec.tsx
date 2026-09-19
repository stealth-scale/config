import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed, rootedViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#nav-list/content.tsx";
import { branched } from "#nav-list/nav-list.fixtures.tsx";
import { Trigger } from "#nav-list/trigger.tsx";

describe("Trigger", () => {
  it("draws a button inside the branch it needs above it", () => {
    const { container } = render(branched(<Trigger>Settings</Trigger>));

    expect(slotElement(container, "nav-list", "trigger").tagName).toBe("BUTTON");
  });

  it("says it submits nothing, so a row inside a form does not", () => {
    render(branched(<Trigger>Settings</Trigger>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("names the list it controls", () => {
    const { container } = render(
      branched(
        <>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </>,
      ),
    );

    expect(screen.getByRole("button").getAttribute("aria-controls")).toBe(
      slotElement(container, "nav-list", "content").id,
    );
  });

  it("keeps a handler a caller hands it beside opening the branch", async () => {
    const heard = vi.fn<() => void>();

    render(branched(<Trigger onClick={heard}>Settings</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(heard).toHaveBeenCalledOnce();
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("says where it was written when it is drawn outside a branch", () => {
    expect(rootedViolations({ Trigger }, /NavList.Branch/u)).toStrictEqual([]);
  });
});
