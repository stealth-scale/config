import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Footer } from "#page/footer.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Footer", () => {
  it("draws a footer inside the column it needs above it", () => {
    const { container } = render(paged(<Footer>Paid on 3 May</Footer>));

    expect(slotElement(container, "page", "footer").tagName).toBe("FOOTER");
  });

  it("stays put where a caller asks", () => {
    const { container } = render(paged(<Footer sticky>Paid on 3 May</Footer>));

    expect(slotElement(container, "page", "footer").dataset["sticky"]).toBe("");
  });
});
