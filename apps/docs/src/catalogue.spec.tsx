import { render } from "@testing-library/react";
import { pages } from "virtual:specimen-index";
import { describe, expect, it } from "vitest";

import { Catalogue } from "#catalogue.tsx";

describe("Catalogue", () => {
  it("reads at least one page out of the index", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it("draws the rail", () => {
    const { getByRole } = render(<Catalogue />);

    expect(getByRole("navigation")).toBeDefined();
  });

  it("draws one button per page the index found", () => {
    const { getAllByRole } = render(<Catalogue />);

    expect(getAllByRole("button")).toHaveLength(pages.length);
  });

  it("opens the first page the index holds", () => {
    const { getAllByText } = render(<Catalogue />);

    expect(getAllByText(pages[0]?.title ?? "").length).toBeGreaterThan(0);
  });

  it("marks the open page as the current one", () => {
    const { getByRole } = render(<Catalogue />);

    expect(getByRole("button", { name: pages[0]?.title ?? "" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("opens the page a reader pressed", () => {
    const last = pages.at(-1);
    const { getByRole } = render(<Catalogue />);

    getByRole("button", { name: last?.title ?? "" }).click();

    expect(getByRole("button", { name: last?.title ?? "" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("says so when it was given no page to list", () => {
    const { getByText } = render(<Catalogue listed={[]} />);

    expect(getByText("No page is open.")).toBeDefined();
  });

  it("draws no rail button when it was given no page to list", () => {
    const { queryAllByRole } = render(<Catalogue listed={[]} />);

    expect(queryAllByRole("button")).toStrictEqual([]);
  });
});
