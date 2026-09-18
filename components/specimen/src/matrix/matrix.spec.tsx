import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses } from "@stealthscale/testing-theme";

import { Matrix } from "#matrix/matrix.tsx";

const SIZES = ["sm", "md", "lg"] as const;

function drawn(knob?: string): HTMLElement {
  return render(
    <Matrix knob={knob} of={SIZES}>
      {(size) => <button type="button">{size}</button>}
    </Matrix>,
  ).container;
}

describe("Matrix", () => {
  it("draws one cell per value of the axis", () => {
    expect(drawn().querySelectorAll("button")).toHaveLength(3);
  });

  it("captions each cell with the value it was drawn for", () => {
    expect(drawn().textContent).toBe("smsmmdmdlglg");
  });

  it("writes the prop before each value when the axis names one", () => {
    expect(drawn("size").textContent).toContain("size = sm");
  });

  it("draws the cells in the order the axis lists them", () => {
    const labels = [...drawn().querySelectorAll("button")].map((held) => held.textContent);

    expect(labels).toStrictEqual(["sm", "md", "lg"]);
  });

  it("names a value through the label the axis states", () => {
    const { container } = render(
      <Matrix label={(size: string) => size.toUpperCase()} of={SIZES}>
        {(size) => <span>{size}</span>}
      </Matrix>,
    );

    expect(container.textContent).toContain("SM");
  });

  it("draws nothing for an axis holding no value", () => {
    const { container } = render(<Matrix of={[]}>{(size: string) => <span>{size}</span>}</Matrix>);

    expect(container.textContent).toBe("");
  });

  it("runs the cells down until a caller asks for a row", () => {
    expect(recipeClasses(drawn(), "stack")).not.toContain("stack--row");
  });

  it("runs the cells across when a caller asks for a row", () => {
    const { container } = render(
      <Matrix direction="row" of={SIZES}>
        {(size) => <span>{size}</span>}
      </Matrix>,
    );

    expect(recipeClasses(container, "stack")).toContain("stack--row");
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Matrix, {
        props: { children: (size: string) => <span>{size}</span>, of: SIZES },
      }),
    ).resolves.toStrictEqual([]);
  });
});
