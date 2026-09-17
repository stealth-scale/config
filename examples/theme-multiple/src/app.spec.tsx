import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { App } from "#app.tsx";

describe("App", () => {
  it("wears the first theme on the document root when it renders", () => {
    render(<App />);

    expect(document.documentElement.dataset["theme"]).toBe("fathom");
    expect(document.documentElement.dataset["colorMode"]).toBe("light");
  });

  it("keeps the theme when it renders again", () => {
    const { rerender } = render(<App />);

    rerender(<App />);

    expect(document.documentElement.dataset["theme"]).toBe("fathom");
  });

  it("switches the document to the theme a reader picks", () => {
    const { getByLabelText } = render(<App />);

    fireEvent.change(getByLabelText("Theme"), { target: { value: "abyss" } });

    expect(document.documentElement.dataset["theme"]).toBe("abyss");
  });

  it("keeps the theme when the select names nothing installed", () => {
    const { getByLabelText } = render(<App />);

    fireEvent.change(getByLabelText("Theme"), { target: { value: "nope" } });

    expect(document.documentElement.dataset["theme"]).toBe("fathom");
  });

  it("switches the color mode from the button", () => {
    const { getByRole } = render(<App />);

    fireEvent.click(getByRole("button", { name: "Dark mode" }));

    expect(document.documentElement.dataset["colorMode"]).toBe("dark");
  });

  it("switches the color mode back from the same button", () => {
    const { getByRole } = render(<App />);

    fireEvent.click(getByRole("button", { name: "Dark mode" }));
    fireEvent.click(getByRole("button", { name: "Light mode" }));

    expect(document.documentElement.dataset["colorMode"]).toBe("light");
  });

  it("draws each button in the look it names", () => {
    const { getByRole } = render(<App />);

    expect(getByRole("button", { name: "Ghost" }).className).toContain(
      variantClass("button", "variant", "ghost"),
    );
    expect(getByRole("button", { name: "Delete" }).className).toContain(
      variantClass("button", "status", "error"),
    );
    expect(getByRole("button", { name: "Large" }).className).toContain(
      variantClass("button", "size", "lg"),
    );
  });

  it("wears forge on the panel below the page", () => {
    const { getByRole } = render(<App />);

    expect(
      getByRole("button", { name: "Solid in forge" }).closest("section")?.dataset["theme"],
    ).toBe("forge");
  });

  it("draws the candy panel below the forge panel", () => {
    const { getByRole } = render(<App />);

    expect(getByRole("heading", { name: "Eye candy" })).toBeDefined();
  });

  it("draws the looks, the motions and the bento below the candy", () => {
    const { getByRole } = render(<App />);

    expect(getByRole("heading", { name: "Looks" })).toBeDefined();
    expect(getByRole("heading", { name: "Motions" })).toBeDefined();
    expect(getByRole("region", { name: "Bento" })).toBeDefined();
  });
});
