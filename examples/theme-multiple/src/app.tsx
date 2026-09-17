/**
 * Draws the page: the controls that switch the theme and the color mode of the document with a
 * badge naming the mode, a row of buttons in every look, a panel wearing a theme of its own, four
 * cards, the candy panel, the looks, the motions, a bento, and the typography and actions
 * packages' components.
 *
 * @remarks
 *   The provider writes the two attributes onto the document root, so the whole page switches at
 *   once. The Forge panel states its theme on itself, which is how a subtree wears another theme
 *   while the page keeps its own. The page's own layout is written with `css`, reading the same
 *   semantic tokens a recipe reads, so every theme moves it too.
 */

import { type ChangeEvent, type ReactElement, useState } from "react";

import { Button } from "@stealthscale/example-lib-actions";
import { type ColorMode, css, ThemeProvider } from "@stealthscale/theme";

import { Badge } from "#badge/badge.ts";
import { Bento } from "#bento.tsx";
import { Candy } from "#candy.tsx";
import { Cards } from "#cards.tsx";
import { Looks } from "#looks.tsx";
import { Motions } from "#motions.tsx";
import { Published } from "#published.tsx";

/**
 * Lists the themes the application installed, in the order `theme.config.ts` states them.
 */
const THEMES = ["fathom", "folio", "forge", "abyss"] as const;

/**
 * Selects one of the installed themes.
 */
type ThemeName = (typeof THEMES)[number];

/**
 * Lays the page out as a column with the large gap and inset, over a field of dots.
 */
const page = css({
  display: "flex",
  flexDirection: "column",
  gap: "gap.lg",
  layerStyle: "backdrop.dots",
  minHeight: "100dvh",
  padding: "inset.lg",
});

/**
 * Sets the title in the large heading style.
 */
const title = css({ textStyle: "heading.lg" });

/**
 * Lays a row of controls out, wrapping where the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Keeps the switches at the top of the page while the rest scrolls past, on the page's own
 * surface so nothing shows through.
 */
const switches = css({
  alignItems: "center",
  background: "bg",
  display: "flex",
  flexWrap: "wrap",
  gap: "gap.sm",
  paddingBlock: "inset.sm",
  position: "sticky",
  top: "0",
  zIndex: "sticky",
});

/**
 * Draws a panel on the panel surface, with the medium corner and inset.
 */
const panel = css({
  background: "bg.panel",
  borderColor: "border",
  borderRadius: "l2",
  borderWidth: "sm",
  display: "flex",
  flexDirection: "column",
  gap: "gap.md",
  padding: "inset.md",
});

/**
 * Reports whether a select's value names an installed theme.
 */
function isThemeName(value: string): value is ThemeName {
  return THEMES.some((name) => name === value);
}

/**
 * Draws the page and switches the document to the theme and the color mode a reader picks.
 */
export function App(): ReactElement {
  const [themeName, setThemeName] = useState<ThemeName>(THEMES[0]);
  const [mode, setMode] = useState<ColorMode>("light");

  /**
   * Switches the document to the theme the select names.
   */
  const pickTheme = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (isThemeName(event.target.value)) setThemeName(event.target.value);
  };

  return (
    <ThemeProvider colorMode={mode} theme={themeName}>
      <main className={page}>
        <h1 className={title}>Themed</h1>
        <p className={switches}>
          <label htmlFor="theme">Theme</label>
          <select id="theme" onChange={pickTheme} value={themeName}>
            {THEMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Button
            onClick={() => {
              setMode(mode === "light" ? "dark" : "light");
            }}
            variant="outline"
          >
            {mode === "light" ? "Dark mode" : "Light mode"}
          </Button>
          <Badge>{mode}</Badge>
        </p>
        <p className={row}>
          <Button>Solid</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button status="error">Delete</Button>
          <Button size="lg">Large</Button>
        </p>
        <section className={panel} data-theme="forge">
          <h2>A panel wearing forge</h2>
          <p className={row}>
            <Button>Solid in forge</Button>
            <Button variant="subtle">Subtle in forge</Button>
            <Button size="lg">Hero in forge</Button>
          </p>
        </section>
        <Cards />
        <Candy />
        <Looks />
        <Motions />
        <Bento />
        <Published />
      </main>
    </ThemeProvider>
  );
}
