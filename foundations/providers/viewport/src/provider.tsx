/**
 * Lays a subtree out for a stated width rather than the window's.
 */

import { type ReactElement, type ReactNode, useState } from "react";

import { ViewportContext } from "#context.ts";
import { type Size, sizesOf } from "#size.ts";

/**
 * Describes what {@link ViewportProvider} is given.
 */
export interface ViewportProviderProps {
  /**
   * The subtree laid out for the width.
   */
  children?: ReactNode | undefined;

  /**
   * The widths to offer, narrowest first. Where each of the theme's breakpoints starts, where this
   * is absent.
   */
  sizes?: readonly Size[] | undefined;

  /**
   * The width to start at, in pixels. Absent leaves the window to decide.
   */
  width?: number | undefined;
}

/**
 * Lays its subtree out for a stated width, or for the window until one is stated.
 *
 * @remarks
 *   A catalogue states a width to show a page as a phone sees it, and a specification states one to
 *   render a component at a size without stubbing `matchMedia`. The breakpoint hooks read the
 *   stated width before they read the window.
 *   A style prop such as `{ base, md }` compiles to a media query and keeps following the window,
 *   because a query is matched by the browser and knows nothing about this. A block that has to
 *   follow the stated width is switched with `useBreakpointValue` instead.
 * @returns The subtree, with the viewport in scope.
 */
export function ViewportProvider({
  children,
  sizes,
  width: initial,
}: ViewportProviderProps): ReactElement {
  const [width, setWidth] = useState(initial);

  return (
    <ViewportContext value={{ setWidth, sizes: sizes ?? sizesOf(), width }}>
      {children}
    </ViewportContext>
  );
}
