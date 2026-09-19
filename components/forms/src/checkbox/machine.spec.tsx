import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  type CheckboxOptions,
  splitCheckboxProps,
  useCheckbox,
  useCheckboxMachine,
} from "#checkbox/machine.ts";

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
 */
function Running(props: CheckboxOptions): ReactElement {
  const api = useCheckboxMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns Which of the three states the box is in.
 */
function Reader(): ReactElement {
  const api = useCheckbox();

  return <span data-testid="state">{String(api.checkedState)}</span>;
}

describe("splitCheckboxProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitCheckboxProps({ defaultChecked: true, name: "terms" });

    expect(options).toStrictEqual({ defaultChecked: true, name: "terms" });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitCheckboxProps({ defaultChecked: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("reads the list off the machine rather than one this package keeps", () => {
    const [options, rest] = splitCheckboxProps({ className: "mine", readOnly: true });

    expect(options).toStrictEqual({ readOnly: true });
    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useCheckboxMachine", () => {
  it("answers a running machine a part can read", () => {
    render(<Running defaultChecked />);

    expect(screen.getByTestId("state").textContent).toBe("true");
  });

  it("starts off where a caller says nothing", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("false");
  });

  it("starts partly on where a caller asks for it", () => {
    render(<Running checked="indeterminate" />);

    expect(screen.getByTestId("state").textContent).toBe("indeterminate");
  });
});
