import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  type ListboxOptions,
  splitListboxProps,
  useListbox,
  useListboxMachine,
} from "#listbox/machine.ts";
import { COLLECTION } from "#listbox/rows.fixtures.ts";

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The chosen values, drawn as text.
 */
function Running(props: ListboxOptions): ReactElement {
  const api = useListboxMachine({ ...props, id: props.id ?? "probe" });

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns The values the list holds as chosen.
 */
function Reader(): ReactElement {
  const api = useListbox();

  return <span data-testid="value">{api.value.join(",")}</span>;
}

describe("splitListboxProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitListboxProps({
      collection: COLLECTION,
      id: "probe",
      loopFocus: true,
    });

    expect(options).toMatchObject({ id: "probe", loopFocus: true });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitListboxProps({ collection: COLLECTION, id: "probe", size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useListboxMachine", () => {
  it("answers a running machine a part can read", () => {
    render(<Running collection={COLLECTION} value={["reports"]} />);

    expect(screen.getByTestId("value").textContent).toBe("reports");
  });

  it("holds nothing chosen where a caller says nothing", () => {
    render(<Running collection={COLLECTION} />);

    expect(screen.getByTestId("value").textContent).toBe("");
  });
});
