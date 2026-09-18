import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  splitTooltipProps,
  type TooltipOptions,
  useTooltip,
  useTooltipMachine,
} from "#tooltip/machine.ts";

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
 */
function Running(props: TooltipOptions): ReactElement {
  const api = useTooltipMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns Whether the box is open.
 */
function Reader(): ReactElement {
  const api = useTooltip();

  return <span data-testid="state">{api.open ? "open" : "shut"}</span>;
}

describe("splitTooltipProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitTooltipProps({ closeDelay: 0, openDelay: 0 });

    expect(options).toStrictEqual({ closeDelay: 0, openDelay: 0 });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitTooltipProps({ openDelay: 0, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useTooltipMachine", () => {
  it("answers a running machine a part can read", async () => {
    await drawn(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("starts shut where a caller says nothing", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("shut");
  });

  it("keeps the machine's own default where a caller hands over nothing for it", async () => {
    await drawn(<Running defaultOpen openDelay={undefined} />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });
});
