import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Errors } from "#errors.tsx";

describe("Errors", () => {
  it("draws an empty region carrying the id and the tab index the foundation finds it by", () => {
    const { getByRole } = render(<Errors errors={[]} id="contact-errors" />);
    const region = getByRole("alert");

    expect(region.id).toBe("contact-errors");
    expect(region.tabIndex).toBe(-1);
    expect(region.textContent).toBe("");
  });

  it("draws a paragraph for every error it is given", () => {
    const errors = ["Pick a topic", "Enter your email address"];
    const { getByRole } = render(<Errors errors={errors} id="contact-errors" />);
    const lines = getByRole("alert").querySelectorAll("p");

    expect([...lines].map((line) => line.textContent)).toStrictEqual(errors);
  });
});
