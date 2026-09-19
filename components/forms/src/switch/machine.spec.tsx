import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  splitSwitchProps,
  type SwitchOptions,
  useSwitch,
  useSwitchMachine,
} from "#switch/machine.ts";

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
 */
function Running(props: SwitchOptions): ReactElement {
  const api = useSwitchMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns Whether the switch is on.
 */
function Reader(): ReactElement {
  const api = useSwitch();

  return <span data-testid="state">{api.checked ? "on" : "off"}</span>;
}

describe("splitSwitchProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitSwitchProps({ defaultChecked: true, name: "theme" });

    expect(options).toStrictEqual({ defaultChecked: true, name: "theme" });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitSwitchProps({ defaultChecked: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("reads the list off the machine rather than one this package keeps", () => {
    const [options, rest] = splitSwitchProps({ className: "mine", readOnly: true });

    expect(options).toStrictEqual({ readOnly: true });
    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useSwitchMachine", () => {
  it("answers a running machine a part can read", () => {
    render(<Running defaultChecked />);

    expect(screen.getByTestId("state").textContent).toBe("on");
  });

  it("starts off where a caller says nothing", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("off");
  });
});
