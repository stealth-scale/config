import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageProvider } from "#page/state.ts";
import { When } from "#page/when.ts";

/**
 * Draws a switch under a page of the width a case names.
 *
 * @param narrow - Whether the page has folded.
 * @param when - The width the parts are drawn at.
 * @returns The switch, under a page of that width.
 */
function under(narrow: boolean, when?: "narrow" | "wide"): React.ReactElement {
  return (
    <PageProvider value={{ narrow, size: "md" }}>
      <When when={when}>
        <span>Invoices</span>
      </When>
    </PageProvider>
  );
}

describe("When", () => {
  it("draws its parts at every width where it names none", () => {
    render(under(false));

    expect(screen.getByText("Invoices")).toBeTruthy();
  });

  it("draws a narrow part on a folded page", () => {
    render(under(true, "narrow"));

    expect(screen.getByText("Invoices")).toBeTruthy();
  });

  it("takes a narrow part out of a page that has not folded", () => {
    render(under(false, "narrow"));

    expect(screen.queryByText("Invoices")).toBeNull();
  });

  it("takes a wide part out of a folded page", () => {
    render(under(true, "wide"));

    expect(screen.queryByText("Invoices")).toBeNull();
  });

  it("draws no element of its own", () => {
    const { container } = render(under(false));

    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });
});
