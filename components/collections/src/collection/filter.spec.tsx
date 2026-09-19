import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type FilterOptions, useFilter } from "#collection/filter.ts";

/**
 * Reads a filter and reports one test off the screen.
 *
 * @param props - The filter's settings and the pair to test.
 * @returns Whether the haystack holds the needle.
 */
function Reader(props: { haystack: string; needle: string } & FilterOptions): ReactElement {
  const { haystack, needle, ...options } = props;
  const filter = useFilter(options);

  return <span data-testid="held">{String(filter.contains(haystack, needle))}</span>;
}

/**
 * Reads the filter and reports which tests it offers.
 *
 * @returns The names, in order.
 */
function Named(): ReactElement {
  const filter = useFilter();

  return <span data-testid="names">{Object.keys(filter).toSorted().join(",")}</span>;
}

describe("useFilter", () => {
  it("folds accents so a reader typing without them still matches", () => {
    render(<Reader haystack="Café" needle="cafe" />);

    expect(screen.getByTestId("held").textContent).toBe("true");
  });

  it("folds case so a reader typing in lower case still matches", () => {
    render(<Reader haystack="Invoices" needle="invoices" />);

    expect(screen.getByTestId("held").textContent).toBe("true");
  });

  it("answers false where the text does not hold the typed text", () => {
    render(<Reader haystack="Invoices" needle="reports" />);

    expect(screen.getByTestId("held").textContent).toBe("false");
  });

  it("tells accents apart where a caller asks for it", () => {
    render(<Reader haystack="Café" needle="cafe" sensitivity="accent" />);

    expect(screen.getByTestId("held").textContent).toBe("false");
  });

  it("offers the three tests a list is narrowed by", () => {
    render(<Named />);

    expect(screen.getByTestId("names").textContent).toBe("contains,endsWith,startsWith");
  });
});
