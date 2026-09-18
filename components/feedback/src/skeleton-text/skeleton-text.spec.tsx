import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement } from "@stealthscale/testing-theme";

import { SkeletonText } from "#skeleton-text/skeleton-text.tsx";

describe("SkeletonText", () => {
  it("breaks no accessibility rule", async () => {
    await expect(accessibilityViolations(SkeletonText)).resolves.toStrictEqual([]);
  });

  it("draws three bars where a caller asks for no count", () => {
    const { container } = render(<SkeletonText />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(3);
  });

  it("draws one bar per line a caller asks for", () => {
    const { container } = render(<SkeletonText lines={6} />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(6);
  });

  it("draws one bar where a caller asks for fewer than one", () => {
    const { container } = render(<SkeletonText lines={0} />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(1);
  });

  it("hands every bar the motion the paragraph was given", () => {
    const { container } = render(<SkeletonText lines={2} motion="shimmer" />);

    for (const bar of recipeElement(container, "skeleton-text").children) {
      expect(bar.className).toContain("shimmer");
    }
  });

  it("hands every bar the corner the paragraph was given", () => {
    const { container } = render(<SkeletonText lines={2} radius="full" />);

    for (const bar of recipeElement(container, "skeleton-text").children) {
      expect(bar.className).toContain("full");
    }
  });

  it("draws the element as names", () => {
    const { container } = render(<SkeletonText as="section" />);

    expect(recipeElement(container, "skeleton-text").tagName).toBe("SECTION");
  });

  it("draws its own class on the column", () => {
    const { container } = render(<SkeletonText />);

    expect(recipeClasses(container, "skeleton-text")).toContain("skeleton-text");
  });
});
