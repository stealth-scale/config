/**
 * Draws the one component two applications share.
 *
 * @remarks
 *   The stylesheet is imported here rather than left to the consumer, so the
 *   component arrives styled. The packer collects that import into
 *   `./style.css`, which a consumer loads once for the whole library.
 */

import { type ReactElement, type ReactNode } from "react";

import "#panel.css";

/**
 * Hands a panel its heading and its body.
 *
 * @remarks
 *   Neither member is optional. A panel with no heading is a plain box, and
 *   this component does not draw one.
 */
export interface PanelProps {
  /**
   * The content drawn inside the panel.
   */
  children: ReactNode;

  /**
   * The heading, drawn as an `h2`.
   */
  title: string;
}

/**
 * Draws a titled box around whatever it was given.
 *
 * @remarks
 *   The heading is always an `h2`, so a page placing a panel outside a section
 *   that owns an `h1` gets a heading order a screen reader reports as skipped.
 *   Nothing is passed through to the `section` element, and a caller needing an
 *   id or a class on it has to wrap the panel instead.
 */
export function Panel({ children, title }: PanelProps): ReactElement {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}
