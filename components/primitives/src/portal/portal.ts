/**
 * Draws what it holds somewhere else in the document rather than where it is written.
 *
 * @remarks
 *   A box positioned against the viewport inside a page that clips or stacks is clipped or stacked
 *   with it, which is the reason to reach for a portal at all. The portal draws nothing until it
 *   has mounted, so a server renders nothing and the first client render matches it: drawing on
 *   the server is impossible, because a portal needs a document, and drawing on the first client
 *   render instead would be a mismatch a browser reports. A caller who wants the content where it
 *   was written says so rather than leaving the portal out, so the tree is the same either way.
 */

import { type ReactNode, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * Ends a subscription to a fact that never changes, which takes nothing.
 */
function unsubscribe(): void {}

/**
 * Subscribes to whether a document is there, which nothing ever reports a change to.
 */
function subscribe(): () => void {
  return unsubscribe;
}

/**
 * Reports the document a browser draws into.
 */
function drawn(): boolean {
  return true;
}

/**
 * Reports no document, which is what rendering a page to a string has.
 */
function undrawn(): boolean {
  return false;
}

/**
 * Describes what a portal takes.
 */
export interface PortalProps {
  /**
   * The content the portal draws.
   */
  children?: ReactNode | undefined;

  /**
   * Where the content is drawn, which is the document's body where a caller names nothing.
   */
  container?: Element | null | undefined;

  /**
   * Whether the content is drawn where it was written instead.
   */
  disabled?: boolean | undefined;
}

/**
 * Draws its content at the container rather than where it sits in the tree.
 */
export function Portal(props: PortalProps): ReactNode {
  const { children, container, disabled = false } = props;
  const mounted = useSyncExternalStore(subscribe, drawn, undrawn);

  if (disabled) return children;
  if (!mounted) return undefined;

  return createPortal(children, container ?? document.body);
}
