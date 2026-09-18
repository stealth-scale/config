import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { entry, treeOver, written } from "#catalogue/mounted.fixtures.ts";

const GROUPED = [
  entry("actions/button", "Actions", "Button"),
  entry("data/badge", "Data", "Badge"),
];

const LOOSE = [entry("portal", "", "Portal")];

const THEMING = [written("docs.theming.overview", "Theming", "Overview")];

describe("Rail", () => {
  it("draws a navigation landmark", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("navigation")).toBeDefined();
  });

  it("words the landmark out of the catalogue rather than the key", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("navigation").getAttribute("aria-label")).toBe("Pages");
  });

  it("names every group the declarations carry", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByText("Actions")).toBeDefined();
  });

  it("titles a link with the words the entry carried", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Badge" })).toBeDefined();
  });

  it("words a group the declarations left unnamed", async () => {
    const { result } = await mountRoute(treeOver(LOOSE), "/docs/portal");

    expect(result.getByText("Other")).toBeDefined();
  });

  it("lists a page an application wrote beside the pages the plugin found", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, THEMING), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Overview" })).toBeDefined();
  });

  it("heads a page an application wrote under the group it named", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, THEMING), "/docs/actions/button");

    expect(result.getByText("Theming")).toBeDefined();
  });
});
