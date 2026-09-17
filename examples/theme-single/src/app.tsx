/**
 * Draws the page: a control that switches the color mode of the document, and a row of buttons
 * in every look.
 *
 * @remarks
 *   The application installs one theme, which is the default, so the page writes no theme
 *   attribute. The color mode is the one attribute it writes, on the document root, so the whole
 *   page switches at once. The page's own layout is written with `css`, reading the same semantic
 *   tokens a recipe reads.
 */

import { type ReactElement, useEffect, useState } from "react";

import { Button } from "@stealthscale/example-lib-actions";
import { COLOR_MODE_ATTRIBUTE, css } from "@stealthscale/theme";

/**
 * Selects one of the two color modes.
 */
type ColorMode = "dark" | "light";

/**
 * Lays the page out as a column with the large gap and inset.
 */
const page = css({ display: "flex", flexDirection: "column", gap: "gap.lg", padding: "inset.lg" });

/**
 * Sets the title in the large heading style.
 */
const title = css({ textStyle: "heading.lg" });

/**
 * Lays a row of controls out, wrapping where the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Draws the page and writes the color mode a reader picks onto the document root.
 */
export function App(): ReactElement {
  const [mode, setMode] = useState<ColorMode>("light");

  useEffect(() => {
    document.documentElement.setAttribute(COLOR_MODE_ATTRIBUTE, mode);
  }, [mode]);

  return (
    <main className={page}>
      <h1 className={title}>Fathom</h1>
      <p className={row}>
        <Button
          onClick={() => {
            setMode(mode === "light" ? "dark" : "light");
          }}
          variant="outline"
        >
          {mode === "light" ? "Dark mode" : "Light mode"}
        </Button>
      </p>
      <p className={row}>
        <Button>Solid</Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button status="error">Delete</Button>
        <Button size="lg">Large</Button>
      </p>
    </main>
  );
}
