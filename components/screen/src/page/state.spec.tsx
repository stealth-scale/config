import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageProvider, shown, useOptionalPage, usePage } from "#page/state.ts";

/**
 * Reads the page's state through the hook a part reads it through.
 *
 * @returns The size, drawn as text.
 */
function Reader(): ReactElement {
  const page = usePage();

  return <span data-testid="size">{page.size}</span>;
}

/**
 * Reads the page's state where there may be no page above.
 *
 * @returns The size, or the word for none.
 */
function Optional(): ReactElement {
  const page = useOptionalPage();

  return <span data-testid="size">{page?.size ?? "none"}</span>;
}

describe("usePage", () => {
  it("answers what the provider above it holds", () => {
    render(
      <PageProvider value={{ narrow: false, size: "lg" }}>
        <Reader />
      </PageProvider>,
    );

    expect(screen.getByTestId("size").textContent).toBe("lg");
  });

  it("throws where no page stands above the reader", () => {
    expect(() => render(<Reader />)).toThrow(/Page/u);
  });
});

describe("useOptionalPage", () => {
  it("answers nothing where no page stands above the reader", () => {
    render(<Optional />);

    expect(screen.getByTestId("size").textContent).toBe("none");
  });
});

describe("shown", () => {
  it("draws a part at every width where it states none", () => {
    expect(shown(undefined, true)).toBe(true);
    expect(shown(undefined, false)).toBe(true);
  });

  it("draws a narrow part on a folded page alone", () => {
    expect(shown("narrow", true)).toBe(true);
    expect(shown("narrow", false)).toBe(false);
  });

  it("drops a wide part from a folded page", () => {
    expect(shown("wide", true)).toBe(false);
    expect(shown("wide", false)).toBe(true);
  });
});
