import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Framed } from "#framed.tsx";

describe("Framed", () => {
  it("draws a fieldset with the legend around the members", () => {
    const { container, getByText } = render(
      <Framed legend="Who">
        <p>member</p>
      </Framed>,
    );

    expect(getByText("Who").tagName).toBe("LEGEND");
    expect(container.querySelector("fieldset > p")?.textContent).toBe("member");
  });

  it("draws the members alone where there is no legend", () => {
    const { container } = render(
      <Framed legend={undefined}>
        <p>member</p>
      </Framed>,
    );

    expect(container.querySelector("fieldset")).toBeNull();
    expect(container.querySelector("p")?.textContent).toBe("member");
  });
});
