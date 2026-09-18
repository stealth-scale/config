import { type ReactElement } from "react";

import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Page } from "#page.tsx";
import { type Indexed } from "#types.ts";

function entry(module: unknown, about = ""): Indexed {
  return {
    about,
    group: "Data",
    id: "data/badge",
    load: () => Promise.resolve(module),
    package: "@stealthscale/component-data",
    path: "src/badge.specimen.tsx",
    source: () => Promise.resolve({ default: "" }),
    title: "Badge",
  };
}

function drawn(): ReactElement {
  return <span>drawn</span>;
}

const SIZES = { about: "Every step.", draw: drawn, title: "Sizes" };

function page(scenes: readonly unknown[]): unknown {
  return { default: { id: "data/badge", scenes } };
}

describe("Page", () => {
  it("heads the page with its title", () => {
    const { getByText } = render(<Page entry={entry(page([]))} />);

    expect(getByText("Badge")).toBeDefined();
  });

  it("opens with the sentence the page declares", () => {
    const { getByText } = render(<Page entry={entry(page([]), "A small label.")} />);

    expect(getByText("A small label.")).toBeDefined();
  });

  it("writes no opening where the page declares none", () => {
    const { container } = render(<Page entry={entry(page([]))} />);

    expect(container.textContent).toBe("Badge");
  });

  it("draws each scene the page lists", async () => {
    const { findByText } = render(<Page entry={entry(page([SIZES]))} />);

    await expect(findByText("drawn")).resolves.toBeDefined();
  });

  it("heads a scene with its title", async () => {
    const { findByText } = render(<Page entry={entry(page([SIZES]))} />);

    await expect(findByText("Sizes")).resolves.toBeDefined();
  });

  it("opens a scene with the sentence it declares", async () => {
    const { findByText } = render(<Page entry={entry(page([SIZES]))} />);

    await expect(findByText("Every step.")).resolves.toBeDefined();
  });

  it("writes no opening for a scene that declares none", async () => {
    const quiet = { draw: drawn, title: "Sizes" };
    const { findByText, queryByText } = render(<Page entry={entry(page([quiet]))} />);

    await findByText("drawn");

    expect(queryByText("Every step.")).toBeNull();
  });

  it("draws no scene for a module that declares no page", async () => {
    const { container } = render(<Page entry={entry({})} />);

    await waitFor(() => {
      expect(container.textContent).toBe("Badge");
    });
  });

  it("draws no scene where the module failed to load", async () => {
    const broken: Indexed = { ...entry({}), load: () => Promise.reject(new Error("gone")) };
    const { container } = render(<Page entry={broken} />);

    await waitFor(() => {
      expect(container.textContent).toBe("Badge");
    });
  });

  it("leaves the page alone when it is taken off the screen before the module arrives", () => {
    const { unmount } = render(<Page entry={entry(page([SIZES]))} />);

    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it("keeps quiet when the module fails after the page has left the screen", async () => {
    const broken: Indexed = { ...entry({}), load: () => Promise.reject(new Error("gone")) };
    const { unmount } = render(<Page entry={broken} />);

    unmount();

    await expect(broken.load()).rejects.toThrow("gone");
  });
});
