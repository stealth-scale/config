import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Group } from "#catalogue/grouped.ts";
import { Rail } from "#catalogue/rail.tsx";
import { type Indexed } from "#catalogue/types.ts";

function entry(id: string, title: string): Indexed {
  return {
    about: "",
    group: "Data",
    id,
    load: () => Promise.resolve({}),
    package: "",
    path: `src/${id}.specimen.tsx`,
    source: () => Promise.resolve({ default: "" }),
    title,
  };
}

function noop(): void {
  /* a rail that reports nowhere */
}

const GROUPS: readonly Group[] = [
  { name: "Actions", pages: [entry("actions/button", "Button")] },
  { name: "Data", pages: [entry("data/badge", "Badge")] },
];

describe("Rail", () => {
  it("names every group it was given", () => {
    const { getByText } = render(<Rail chosen="" groups={GROUPS} onChoose={noop} />);

    expect(getByText("Actions")).toBeDefined();
  });

  it("draws one button per page", () => {
    const { getAllByRole } = render(<Rail chosen="" groups={GROUPS} onChoose={noop} />);

    expect(getAllByRole("button")).toHaveLength(2);
  });

  it("titles a button with the page's title", () => {
    const { getByRole } = render(<Rail chosen="" groups={GROUPS} onChoose={noop} />);

    expect(getByRole("button", { name: "Button" })).toBeDefined();
  });

  it("marks the open page as the current one", () => {
    const { getByRole } = render(<Rail chosen="data/badge" groups={GROUPS} onChoose={noop} />);

    expect(getByRole("button", { name: "Badge" }).getAttribute("aria-current")).toBe("page");
  });

  it("marks no other page as current", () => {
    const { getByRole } = render(<Rail chosen="data/badge" groups={GROUPS} onChoose={noop} />);

    expect(getByRole("button", { name: "Button" }).getAttribute("aria-current")).toBeNull();
  });

  it("names the page a reader pressed", () => {
    const onChoose = vi.fn<(id: string) => void>();
    const { getByRole } = render(<Rail chosen="" groups={GROUPS} onChoose={onChoose} />);

    getByRole("button", { name: "Badge" }).click();

    expect(onChoose).toHaveBeenCalledWith("data/badge");
  });

  it("words a group the pages left unnamed", () => {
    const loose: readonly Group[] = [{ name: "", pages: [entry("data/badge", "Badge")] }];
    const { getByText } = render(<Rail chosen="" groups={loose} onChoose={noop} />);

    expect(getByText("Other")).toBeDefined();
  });

  it("draws a navigation landmark", () => {
    const { getByRole } = render(<Rail chosen="" groups={GROUPS} onChoose={noop} />);

    expect(getByRole("navigation")).toBeDefined();
  });
});
