import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  type CollapsibleOptions,
  splitCollapsibleProps,
  useCollapsible,
  useCollapsibleMachine,
} from "#collapsible/machine.ts";

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
 */
function Running(props: CollapsibleOptions): ReactElement {
  const api = useCollapsibleMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns Whether the block is open.
 */
function Reader(): ReactElement {
  const api = useCollapsible();

  return <span data-testid="state">{api.open ? "open" : "closed"}</span>;
}

describe("splitCollapsibleProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitCollapsibleProps({ defaultOpen: true, disabled: true });

    expect(options).toStrictEqual({ defaultOpen: true, disabled: true });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitCollapsibleProps({ defaultOpen: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("reads the list off the machine rather than one this package keeps", () => {
    const [options, rest] = splitCollapsibleProps({ className: "mine", collapsedHeight: 24 });

    expect(options).toStrictEqual({ collapsedHeight: 24 });
    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useCollapsibleMachine", () => {
  it("answers a running machine a part can read", () => {
    render(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("starts closed where a caller says nothing", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("closed");
  });
});
