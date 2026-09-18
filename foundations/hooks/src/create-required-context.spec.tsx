import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createRequiredContext } from "#create-required-context.ts";

const [Provider, useHeld, useOptionalHeld] = createRequiredContext<string>("Collapsible");

/**
 * Draws what the provider above holds, so a case can read it off the screen.
 *
 * @returns The value.
 */
function Part(): ReactElement {
  return <span data-testid="held">{useHeld()}</span>;
}

/**
 * Draws what the provider above holds, or the word none where no provider stands above it.
 *
 * @returns The value, or the word none.
 */
function Nestable(): ReactElement {
  return <span data-testid="optional">{useOptionalHeld() ?? "none"}</span>;
}

describe("createRequiredContext", () => {
  it("hands the value to a reader below the provider", () => {
    render(
      <Provider value="open">
        <Part />
      </Provider>,
    );

    expect(screen.getByTestId("held").textContent).toBe("open");
  });

  it("hands the nearest provider's value where two stand above a reader", () => {
    render(
      <Provider value="outer">
        <Provider value="inner">
          <Part />
        </Provider>
      </Provider>,
    );

    expect(screen.getByTestId("held").textContent).toBe("inner");
  });

  it("names the component in the error where no provider stands above the reader", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Part />)).toThrow(
      "A part of Collapsible was drawn outside the root that holds it together.",
    );

    quiet.mockRestore();
  });

  it("answers undefined to the optional reader where no provider stands above it", () => {
    render(<Nestable />);

    expect(screen.getByTestId("optional").textContent).toBe("none");
  });

  it("hands the value to the optional reader below the provider", () => {
    render(
      <Provider value="open">
        <Nestable />
      </Provider>,
    );

    expect(screen.getByTestId("optional").textContent).toBe("open");
  });

  it("draws nothing of its own", () => {
    const { container } = render(<Provider value="open" />);

    expect(container.innerHTML).toBe("");
  });

  it("makes a context of its own each time it is called", () => {
    const [Other] = createRequiredContext<string>("Tabs");

    render(
      <Other value="theirs">
        <Provider value="ours">
          <Part />
        </Provider>
      </Other>,
    );

    expect(screen.getByTestId("held").textContent).toBe("ours");
  });
});
