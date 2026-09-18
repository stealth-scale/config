import { type ReactElement, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { SearchInput } from "#search-input/search-input.tsx";

/**
 * Draws a search field a caller drives, so a case can read what a driven one does.
 *
 * @returns The field, holding whatever the last change reported.
 */
function Driven(): ReactElement {
  const [held, setHeld] = useState("");

  return <SearchInput aria-label="Search" onValueChange={setHeld} value={held} />;
}

describe("SearchInput", () => {
  it("breaks no accessibility rule where a caller names it", async () => {
    await expect(
      accessibilityViolations(SearchInput, { props: { "aria-label": "Search invoices" } }),
    ).resolves.toStrictEqual([]);
  });

  it("draws a field of type search", () => {
    render(<SearchInput aria-label="Search" />);

    expect(screen.getByRole("searchbox").getAttribute("type")).toBe("search");
  });

  it("reserves room at the end of the field for the control alone", () => {
    const { container } = render(<SearchInput aria-label="Search" />);

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "marks", "end"),
    );
  });

  it("hands the size a caller states to the field and to the control alike", () => {
    const { container } = render(
      <SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" size="lg" />,
    );

    expect([...screen.getByRole("searchbox").classList]).toContain(
      variantClass("input", "size", "lg"),
    );
    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "lg"),
    );
    expect([...screen.getByRole("button", { name: "Clear search" }).classList]).toContain(
      variantClass("search-input", "size", "lg"),
    );
  });

  it("draws no control where it holds nothing", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("draws no control where a caller hands over nothing to draw in one", () => {
    render(<SearchInput aria-label="Search" defaultValue="invoices" />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("draws the control once it holds something", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" />);

    expect(screen.getByRole("button", { name: "Clear search" })).toBeDefined();
  });

  it("names the control as a caller asks", () => {
    render(
      <SearchInput
        aria-label="Search"
        clearIndicator="x"
        clearLabel="Empty the search"
        defaultValue="invoices"
      />,
    );

    expect(screen.getByRole("button", { name: "Empty the search" })).toBeDefined();
  });

  it("tells a caller what it holds as a person types", () => {
    const told = vi.fn<(value: string) => void>();

    render(<SearchInput aria-label="Search" onValueChange={told} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "ab" } });

    expect(told).toHaveBeenLastCalledWith("ab");
  });

  it("empties itself and returns focus to the field when the control is pressed", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" />);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    const field = screen.getByRole("searchbox");

    expect(field).toHaveProperty("value", "");
    expect(document.activeElement).toBe(field);
  });

  it("follows a caller that drives it", () => {
    render(<Driven />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "abc" } });

    expect(screen.getByRole("searchbox")).toHaveProperty("value", "abc");
  });

  it("draws the control that empties it as a button rather than a submit", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" />);

    expect(screen.getByRole("button", { name: "Clear search" }).getAttribute("type")).toBe(
      "button",
    );
  });
});
