import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "#app.tsx";

describe("App", () => {
  it("draws the rail under the providers", () => {
    const { getByRole } = render(<App />);

    expect(getByRole("navigation")).toBeDefined();
  });

  it("words the rail out of the catalogue rather than the key", () => {
    const { getByRole } = render(<App />);

    expect(getByRole("navigation").getAttribute("aria-label")).toBe("Pages");
  });

  it("writes the locale onto the document root", () => {
    render(<App />);

    expect(document.documentElement.lang).toBe("en");
  });

  it("writes the direction the locale reads in onto the document root", () => {
    render(<App />);

    expect(document.documentElement.dir).toBe("ltr");
  });
});
