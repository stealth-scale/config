/**
 * Draws four cards: the default, a small one in outline, a large subtle one, and one wearing
 * Forge, whose header the theme sets in capitals and whose shadow it lifts.
 *
 * @remarks
 *   Each card is the composition the surfaces package publishes, `Card.Root` holding
 *   `Card.Header`, `Card.Content` and `Card.Footer`, with literal variants on the root, which is
 *   what the compiler extracts the rules for. The bands take no variant of their own. The Forge
 *   card sits in a box that states the theme, so the theme's card extension applies to this card
 *   alone. The box is there because the compiler scopes a theme's recipe rules to the descendants
 *   of the element carrying the attribute, while that element's own tokens switch.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/example-lib-actions";
import { Card } from "@stealthscale/example-lib-surfaces";
import { css } from "@stealthscale/theme";

/**
 * Lays the section out as a column.
 */
const section = css({ display: "flex", flexDirection: "column", gap: "gap.md" });

/**
 * Sets the heading in the medium heading style.
 */
const heading = css({ textStyle: "heading.md" });

/**
 * Lays the cards out two abreast on a desk and one below another on a phone.
 */
const grid = css({
  alignItems: "start",
  display: "grid",
  gap: "gap.md",
  gridTemplateColumns: { base: "repeat(1, minmax(0, 1fr))", md: "repeat(2, minmax(0, 1fr))" },
});

/**
 * Draws the cards.
 */
export function Cards(): ReactElement {
  return (
    <section className={section}>
      <h2 className={heading}>Cards</h2>
      <div className={grid}>
        <Card.Root>
          <Card.Header>Elevated, medium</Card.Header>
          <Card.Content>The look and the size a card has when nothing is asked for.</Card.Content>
          <Card.Footer>
            <Button size="sm" variant="ghost">
              Later
            </Button>
            <Button size="sm">Open</Button>
          </Card.Footer>
        </Card.Root>
        <Card.Root size="sm" variant="outline">
          <Card.Header>Outline, small</Card.Header>
          <Card.Content>An edge and no shadow, with the small inset.</Card.Content>
          <Card.Footer>
            <Button size="sm" variant="outline">
              Open
            </Button>
          </Card.Footer>
        </Card.Root>
        <Card.Root size="lg" variant="subtle">
          <Card.Header>Subtle, large</Card.Header>
          <Card.Content>The subtle surface and no edge, with the large inset.</Card.Content>
          <Card.Footer>
            <Button variant="subtle">Open</Button>
          </Card.Footer>
        </Card.Root>
        <div data-theme="forge">
          <Card.Root>
            <Card.Header>A card wearing forge</Card.Header>
            <Card.Content>Forge sets the header in capitals and lifts the shadow.</Card.Content>
            <Card.Footer>
              <Button size="sm">Open in forge</Button>
            </Card.Footer>
          </Card.Root>
        </div>
      </div>
    </section>
  );
}
