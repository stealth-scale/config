/**
 * The one thing this library draws.
 */

import { type ReactElement, type ReactNode } from "react";

import "#panel.css";

/**
 * Describes a panel.
 */
export interface PanelProps {
  /**
   * What the panel holds. Required, because a box drawn around nothing is a box nobody wanted.
   */
  children: ReactNode;

  /**
   * What the panel is called, shown above what it holds.
   */
  title: string;
}

/**
 * Draws a titled box around whatever it is given.
 *
 * @param props - The panel. `PanelProps` documents every member.
 * @returns The element.
 */
export function Panel({ children, title }: PanelProps): ReactElement {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}
