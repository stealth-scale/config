import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  type PopoverOptions,
  splitPopoverProps,
  usePopover,
  usePopoverMachine,
} from "#popover/machine.ts";

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
 */
function Running(props: PopoverOptions): ReactElement {
  const api = usePopoverMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns Whether the panel is open.
 */
function Reader(): ReactElement {
  const api = usePopover();

  return <span data-testid="state">{api.open ? "open" : "shut"}</span>;
}

describe("splitPopoverProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitPopoverProps({ defaultOpen: true, modal: true });

    expect(options).toStrictEqual({ defaultOpen: true, modal: true });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitPopoverProps({ defaultOpen: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("usePopoverMachine", () => {
  it("answers a running machine a part can read", () => {
    render(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("starts shut where a caller says nothing", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("shut");
  });

  it("keeps the machine's own default where a caller hands over nothing for it", () => {
    render(<Running closeOnEscape={undefined} defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });
});
