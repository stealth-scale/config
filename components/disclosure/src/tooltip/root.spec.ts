import { fireEvent, render, screen } from "@testing-library/react";
import { setInteractionModality } from "@zag-js/focus-visible";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, settled } from "@stealthscale/testing-react";

import { composed } from "#tooltip/tooltip.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a control and its box", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("draws an element that takes part in no layout", () => {
    const { container } = render(composed());

    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("keeps the box shut until something opens it", () => {
    render(composed());

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens the box where a caller says it starts open", async () => {
    render(composed({ defaultOpen: true }));
    await settled();

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("opens the box when a keyboard reaches the control", async () => {
    render(composed({ openDelay: 0 }));
    setInteractionModality("keyboard");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("leaves the box shut where a pointer moved the focus rather than a keyboard", async () => {
    render(composed({ openDelay: 0 }));
    setInteractionModality("pointer");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("tells a caller each time the box opens and shuts", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    render(composed({ onOpenChange: told, openDelay: 0 }));
    setInteractionModality("keyboard");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("follows a caller that drives it", async () => {
    render(composed({ open: true }));
    await settled();

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("stays shut where a caller disables it", async () => {
    render(composed({ disabled: true, openDelay: 0 }));
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
