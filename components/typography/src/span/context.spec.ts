import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { withContext } from "#span/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("i");
    const { container } = render(createElement(Probe, null, "a run"));

    expect(recipeClasses(container, "span")).toContain("span");
  });
});
