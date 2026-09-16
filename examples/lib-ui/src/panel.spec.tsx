/**
 * Pins down what a panel draws, from an empty body to several children.
 *
 * @remarks
 *   The markup is rendered on the server, which needs no DOM and settles in one
 *   pass. The component holds no state, so nothing a browser would add to the
 *   run is being checked here.
 */

import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, test } from "vitest";

import { Panel } from "#panel.tsx";

describe("panel", () => {
  test("shows what the panel is called", () => {
    expect(renderToStaticMarkup(<Panel title="Totals">{"none"}</Panel>)).toContain("Totals");
  });

  test("draws whatever it was given inside the box", () => {
    const held = renderToStaticMarkup(<Panel title="Totals">{"41"}</Panel>);

    expect(held).toContain("41");
  });

  test("draws the box even with nothing in it", () => {
    expect(renderToStaticMarkup(<Panel title="Empty">{null}</Panel>)).toContain("panel");
  });

  test("draws more than one thing inside the box", () => {
    const held = renderToStaticMarkup(
      <Panel title="Totals">
        <span>{"41"}</span>
        <span>{"1"}</span>
      </Panel>,
    );

    expect(held).toContain("41");
  });
});
