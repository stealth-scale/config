/**
 * Audits a rendered React component with axe and reports each rule it breaks.
 *
 * @remarks
 *   The audit renders the component under the same options the conformance check takes, so a part
 *   is audited inside the root it needs and a component that needs props gets them. A rule axe
 *   cannot decide, which it reports as incomplete, is left out. A layered background is what stops
 *   it deciding a contrast, and a page is where that is measured.
 *   The render settles before axe reads it, so a component built on a state machine is audited in
 *   the state it reaches rather than the one it mounts in.
 */

import { createElement, type ElementType } from "react";

import { act } from "@testing-library/react";
import axe from "axe-core";

import { type ConformanceOptions } from "#conformance.ts";
import { drawn } from "#machine.ts";

/**
 * Lists every accessibility rule a rendered component breaks, as the rule's id and its help.
 *
 * @returns Each broken rule as `id: help`, or an empty array for a component that passes every
 *   rule axe can decide.
 */
export async function accessibilityViolations(
  Component: ElementType,
  options: ConformanceOptions = {},
): Promise<readonly string[]> {
  const element = createElement(Component, options.props ?? {});
  const { container, unmount } = await drawn(
    options.wrapper === undefined ? element : options.wrapper(element),
  );

  try {
    const result = await axe.run(container, { resultTypes: ["violations"] });

    return result.violations.map((each) => `${each.id}: ${each.help}`);
  } finally {
    act(() => {
      unmount();
    });
  }
}
