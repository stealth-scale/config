import { type ReactElement } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Keyed, useKeys } from "#app-shell/keys.ts";

/**
 * Records what the panel was told, so a case can read it back.
 */
const told: string[] = [];

/**
 * Listens for one panel's keys, and writes down what the listener asked for.
 *
 * @param props - What the panel is doing, less how it is opened and closed.
 * @returns A field, so a case can press a key while standing somewhere.
 */
function Listener(props: Omit<Keyed, "setOpen">): ReactElement {
  useKeys({
    ...props,
    setOpen: (open) => {
      told.push(open ? "open" : "closed");
    },
  });

  return <input aria-label="Search" />;
}

describe("useKeys", () => {
  it("closes a panel over the page on Escape", () => {
    told.length = 0;
    render(<Listener open overlaid shortcut={undefined} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(told).toStrictEqual(["closed"]);
  });

  it("leaves a panel beside the page alone on Escape", () => {
    told.length = 0;
    render(<Listener open overlaid={false} shortcut={undefined} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(told).toStrictEqual([]);
  });

  it("leaves a panel over the page alone on Escape while it is already closed", () => {
    told.length = 0;
    render(<Listener open={false} overlaid shortcut={undefined} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(told).toStrictEqual([]);
  });

  it("opens a closed panel on its shortcut", () => {
    told.length = 0;
    render(<Listener open={false} overlaid={false} shortcut="b" />);

    fireEvent.keyDown(document, { ctrlKey: true, key: "b" });

    expect(told).toStrictEqual(["open"]);
  });

  it("closes an open panel on its shortcut", () => {
    told.length = 0;
    render(<Listener open overlaid={false} shortcut="b" />);

    fireEvent.keyDown(document, { key: "b", metaKey: true });

    expect(told).toStrictEqual(["closed"]);
  });

  it("leaves the key alone where the modifier is not held", () => {
    told.length = 0;
    render(<Listener open overlaid={false} shortcut="b" />);

    fireEvent.keyDown(document, { key: "b" });

    expect(told).toStrictEqual([]);
  });

  it("hears the key while the reader is standing in a field", () => {
    told.length = 0;
    render(<Listener open overlaid shortcut={undefined} />);

    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });

    expect(told).toStrictEqual(["closed"]);
  });

  it("listens for nothing where the panel states no shortcut", () => {
    told.length = 0;
    render(<Listener open overlaid={false} shortcut={undefined} />);

    fireEvent.keyDown(document, { ctrlKey: true, key: "b" });

    expect(told).toStrictEqual([]);
  });

  it("stops listening once the panel has left", () => {
    told.length = 0;

    const { unmount } = render(<Listener open overlaid shortcut={undefined} />);

    unmount();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(told).toStrictEqual([]);
  });
});
