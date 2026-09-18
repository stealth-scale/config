import { fireEvent, screen } from "@testing-library/react";
import { setInteractionModality } from "@zag-js/focus-visible";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";

import { composed } from "#tooltip/tooltip.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a control and its box", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("draws an element that takes part in no layout", async () => {
    const { container } = await drawn(composed());

    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("keeps the box shut until something opens it", async () => {
    await drawn(composed());

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens the box where a caller says it starts open", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("opens the box when a keyboard reaches the control", async () => {
    await drawn(composed({ openDelay: 0 }));
    setInteractionModality("keyboard");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("leaves the box shut where a pointer moved the focus rather than a keyboard", async () => {
    await drawn(composed({ openDelay: 0 }));
    setInteractionModality("pointer");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("tells a caller each time the box opens and shuts", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told, openDelay: 0 }));
    setInteractionModality("keyboard");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("follows a caller that drives it", async () => {
    await drawn(composed({ open: true }));

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("stays shut where a caller disables it", async () => {
    await drawn(composed({ disabled: true, openDelay: 0 }));
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
