import { describe, expect, it } from "vitest";

import { entry } from "#catalogue/mounted.fixtures.ts";
import { declarations, FRAME, layouts, routeId } from "#catalogue/routes.tsx";

const LISTED = [entry("actions/button", "Actions", "Button"), entry("portal", "", "Portal")];

describe("declarations", () => {
  it("names a page under the prefix with its slashes as dots", () => {
    expect(routeId("actions/button")).toBe("specimen.actions.button");
  });

  it("names a page that holds no slash under the prefix alone", () => {
    expect(routeId("portal")).toBe("specimen.portal");
  });

  it("returns one declaration per page", () => {
    expect(declarations(LISTED)).toHaveLength(2);
  });

  it("keeps the pages in the order the index gave them", () => {
    expect(declarations(LISTED).map((one) => one.id)).toStrictEqual([
      "specimen.actions.button",
      "specimen.portal",
    ]);
  });

  it("addresses a page by the identifier it declares and no leading slash", () => {
    expect(declarations(LISTED)[0]?.path).toBe("actions/button");
  });

  it("draws every page inside the catalogue's frame", () => {
    expect(declarations(LISTED)[0]?.layout).toStrictEqual([FRAME]);
  });

  it("carries the words and the group a rail lists the page by", () => {
    expect(declarations(LISTED)[0]?.navigation).toStrictEqual({
      group: "Actions",
      label: "Button",
    });
  });

  it("returns nothing for an index that found no page", () => {
    expect(declarations([])).toStrictEqual([]);
  });

  it("provides the frame every declaration asks for", () => {
    expect(Object.keys(layouts(declarations(LISTED)))).toStrictEqual([FRAME]);
  });
});
