import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { App } from "#app.tsx";

describe("App", () => {
  it("writes the light mode on the document root when it renders", () => {
    render(<App />);

    expect(document.documentElement.dataset["colorMode"]).toBe("light");
  });

  it("writes no theme attribute on the document root", () => {
    render(<App />);

    expect(document.documentElement.dataset["theme"]).toBeUndefined();
  });

  it("keeps the color mode when it renders again", () => {
    const { rerender } = render(<App />);

    rerender(<App />);

    expect(document.documentElement.dataset["colorMode"]).toBe("light");
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
});
