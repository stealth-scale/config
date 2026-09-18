import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "#app.tsx";

describe("App", () => {
  it("writes the locale onto the document root", () => {
    render(<App />);

    expect(document.documentElement.lang).toBe("en");
  });

  it("writes the direction the locale reads in onto the document root", () => {
    render(<App />);

    expect(document.documentElement.dir).toBe("ltr");
  });

  it("draws without throwing, which is the providers agreeing on their order", () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
