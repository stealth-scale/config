import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "#provider.tsx";
import { type Switched, useTheme } from "#use-theme.ts";

function Probe(): ReactElement {
  const { colorMode, theme } = useTheme();

  return <output>{`${theme ?? "none"} ${colorMode ?? "none"}`}</output>;
}

describe("ThemeProvider", () => {
  it("writes the theme and the color mode onto the document root", () => {
    render(<ThemeProvider colorMode="dark" theme="abyss" />);

    expect(document.documentElement.dataset["theme"]).toBe("abyss");
    expect(document.documentElement.dataset["colorMode"]).toBe("dark");
  });

  it("keeps the attributes when it renders again with the same props", () => {
    const { rerender } = render(<ThemeProvider colorMode="dark" theme="abyss" />);

    rerender(<ThemeProvider colorMode="dark" theme="abyss" />);

    expect(document.documentElement.dataset["theme"]).toBe("abyss");
    expect(document.documentElement.dataset["colorMode"]).toBe("dark");
  });

  it("removes an attribute the page stops stating", () => {
    const { rerender } = render(<ThemeProvider colorMode="dark" theme="abyss" />);

    rerender(<ThemeProvider />);

    expect(document.documentElement.dataset["theme"]).toBeUndefined();
    expect(document.documentElement.dataset["colorMode"]).toBeUndefined();
  });

  it("removes an attribute the page wrote in its markup and did not hand over", () => {
    document.documentElement.dataset["colorMode"] = "dark";

    render(<ThemeProvider theme="fathom" />);

    expect(document.documentElement.dataset["colorMode"]).toBeUndefined();
  });

  it("leaves both attributes on the document root when it unmounts", () => {
    const { unmount } = render(<ThemeProvider colorMode="dark" theme="abyss" />);

    unmount();

    expect(document.documentElement.dataset["theme"]).toBe("abyss");
    expect(document.documentElement.dataset["colorMode"]).toBe("dark");
  });

  it("tells a part below which theme and mode the page is switched to", () => {
    const { container } = render(
      <ThemeProvider colorMode="light" theme="fathom">
        <Probe />
      </ThemeProvider>,
    );

    expect(container.textContent).toBe("fathom light");
  });

  it("hands the same pair down when it renders again with the same props", () => {
    const seen: Switched[] = [];

    function Reader(): ReactElement {
      seen.push(useTheme());

      return <output />;
    }

    const { rerender } = render(
      <ThemeProvider colorMode="dark" theme="abyss">
        <Reader />
      </ThemeProvider>,
    );

    rerender(
      <ThemeProvider colorMode="dark" theme="abyss">
        <Reader />
      </ThemeProvider>,
    );

    expect(seen).toHaveLength(2);
    expect(seen[0]).toBe(seen[1]);
  });
});
