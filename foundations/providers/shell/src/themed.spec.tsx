import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  COLOR_MODE_SETTING,
  type ColorModeChoice,
  ColorModeProvider,
} from "@stealthscale/provider-color-mode";
import { memoryStore, settingKey } from "@stealthscale/settings";

import { Switched } from "#shell.fixtures.tsx";
import { Themed } from "#themed.tsx";

/**
 * Mounts the theme reader under a colour mode a person already chose.
 *
 * @param choice - The choice the store holds.
 * @param theme - The theme to switch to.
 */
function mounted(choice: ColorModeChoice, theme?: string): void {
  const store = memoryStore();

  store.write(settingKey("probe", COLOR_MODE_SETTING), choice);

  render(
    <ColorModeProvider app="probe" store={store}>
      <Themed theme={theme}>
        <Switched />
      </Themed>
    </ColorModeProvider>,
  );
}

describe("Themed", () => {
  it("passes a chosen mode to the theme provider", () => {
    mounted("dark", "forge");

    expect(screen.getByText("forge/dark")).toBeTruthy();
  });

  it("passes no mode while a person follows the machine", () => {
    mounted("system", "forge");

    expect(screen.getByText("forge/none")).toBeTruthy();
  });

  it("removes the colour mode attribute while a person follows the machine", () => {
    mounted("system", "forge");

    expect(Object.hasOwn(document.documentElement.dataset, "colorMode")).toBe(false);
  });

  it("writes a chosen mode onto the document root", () => {
    mounted("dark", "forge");

    expect(document.documentElement.dataset["colorMode"]).toBe("dark");
  });

  it("switches the document to no theme when it is given none", () => {
    mounted("system");

    expect(screen.getByText("none/none")).toBeTruthy();
  });
});
