import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Catalogue } from "#catalogue/catalogue.tsx";
import { type Indexed } from "#catalogue/types.ts";

function entry(id: string, group: string, title: string): Indexed {
  return {
    about: "",
    group,
    id,
    load: () => Promise.resolve({}),
    package: "@stealthscale/component-actions",
    path: `src/${id}.specimen.tsx`,
    source: () => Promise.resolve({ default: "" }),
    title,
  };
}

const LISTED: readonly Indexed[] = [
  entry("actions/button", "Actions", "Button"),
  entry("data/badge", "Data", "Badge"),
];

describe("Catalogue", () => {
  it("draws the rail", () => {
    const { getByRole } = render(<Catalogue listed={LISTED} />);

    expect(getByRole("navigation")).toBeDefined();
  });

  it("draws one rail button per page it was given", () => {
    const { getAllByRole } = render(<Catalogue listed={LISTED} />);

    expect(getAllByRole("button")).toHaveLength(2);
  });

  it("opens the first page it was given", () => {
    const { getAllByText } = render(<Catalogue listed={LISTED} />);

    expect(getAllByText("Button").length).toBeGreaterThan(0);
  });

  it("marks the open page as the current one", () => {
    const { getByRole } = render(<Catalogue listed={LISTED} />);

    expect(getByRole("button", { name: "Button" }).getAttribute("aria-current")).toBe("page");
  });

  it("leaves the first page current until a reader presses another", () => {
    const { getByRole } = render(<Catalogue listed={LISTED} />);

    expect(getByRole("button", { name: "Badge" }).getAttribute("aria-current")).toBeNull();
  });

  it("opens the page a reader pressed", () => {
    const { getByRole } = render(<Catalogue listed={LISTED} />);

    fireEvent.click(getByRole("button", { name: "Badge" }));

    expect(getByRole("button", { name: "Badge" }).getAttribute("aria-current")).toBe("page");
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
