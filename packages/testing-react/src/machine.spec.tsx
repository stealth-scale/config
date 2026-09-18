import { createContext, type ReactElement, use, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { rootedViolations, settled } from "#machine.ts";

const Held = createContext<string | undefined>(undefined);

/**
 * Draws a control whose state settles on a microtask, the way a machine's does.
 *
 * @returns The control, saying what it holds.
 */
function Scheduled(): ReactElement {
  const [held, setHeld] = useState("closed");

  return (
    <button
      onClick={() => {
        queueMicrotask(() => {
          setHeld("open");
        });
      }}
      type="button"
    >
      {held}
    </button>
  );
}

/**
 * Draws what a root above it holds, and throws where none does.
 *
 * @returns The value.
 */
function Part(): ReactElement {
  const held = use(Held);

  if (held === undefined) throw new Error("A part of Probe was drawn outside its root.");

  return <span>{held}</span>;
}

/**
 * Draws a part that needs nothing above it.
 *
 * @returns The part.
 */
function Loose(): ReactElement {
  return <span>fine</span>;
}

/**
 * Draws a part that throws something else entirely.
 *
 * @returns Nothing. It throws.
 */
function Wrong(): ReactElement {
  throw new Error("something else");
}

/**
 * Draws a part that throws a value rather than an error.
 *
 * @returns Nothing. It throws.
 */
function Bare(): ReactElement {
  // A library that throws a plain value is the case this covers.
  // eslint-disable-next-line no-throw-literal, typescript/only-throw-error -- as above
  throw "A part of Probe was drawn outside its root.";
}

describe("settled", () => {
  it("waits for a state change the interaction only scheduled", async () => {
    render(<Scheduled />);
    fireEvent.click(screen.getByRole("button"));
    await settled();

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("leaves a component that changed nothing alone", async () => {
    render(<Scheduled />);
    await settled();

    expect(screen.getByRole("button").textContent).toBe("closed");
  });
});

describe("rootedViolations", () => {
  it("accepts a part that throws what it is expected to", () => {
    expect(rootedViolations({ Part }, "drawn outside its root")).toStrictEqual([]);
  });

  it("accepts a part whose throw matches a pattern", () => {
    expect(rootedViolations({ Part }, /outside its root/u)).toStrictEqual([]);
  });

  it("names a part that draws without the root it needs", () => {
    expect(rootedViolations({ Loose }, "drawn outside its root")).toStrictEqual([
      "Loose draws outside the root it needs above it",
    ]);
  });

  it("names a part that throws something else", () => {
    expect(rootedViolations({ Wrong }, "drawn outside its root")).toStrictEqual([
      "Wrong throws Error: something else, which is not what it says",
    ]);
  });

  it("reads a part that throws a value rather than an error", () => {
    expect(rootedViolations({ Bare }, "drawn outside its root")).toStrictEqual([]);
  });

  it("reads every part it is given", () => {
    expect(rootedViolations({ Loose, Part }, "drawn outside its root")).toStrictEqual([
      "Loose draws outside the root it needs above it",
    ]);
  });

  it("accepts being given no parts at all", () => {
    expect(rootedViolations({}, "drawn outside its root")).toStrictEqual([]);
  });
});
