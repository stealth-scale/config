import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeContext, useTheme } from "#use-theme.ts";

function Probe(): ReactElement {
  const { colorMode, theme } = useTheme();

  return <output>{`${theme ?? "none"} ${colorMode ?? "none"}`}</output>;
}

describe("useTheme", () => {
  it("reads undefined for both outside a provider", () => {
    const { container } = render(<Probe />);

    expect(container.textContent).toBe("none none");
  });

  it("reads what the nearest context above carries", () => {
    const { container } = render(
      <ThemeContext value={{ colorMode: "dark", theme: "abyss" }}>
        <Probe />
      </ThemeContext>,
    );

    expect(container.textContent).toBe("abyss dark");
  });
});
