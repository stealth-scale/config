/**
 * Lays a subtree out for a stated width rather than the window's.
 */

import { type ReactElement, type ReactNode } from "react";

import { useControllableState } from "@stealthscale/hooks";

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
   * The width to start at, in pixels, where the caller does not own the width. Absent leaves the
   * window to decide until something states one.
   */
  defaultWidth?: number | undefined;

  /**
   * Told whenever the width is set, controlled or not, so a caller that owns the width learns what
   * to set it to.
   */
  onWidthChange?: ((width: number | undefined) => void) | undefined;

  /**
   * The widths to offer, narrowest first. Where each of the theme's breakpoints starts, where this
   * is absent.
   */
  sizes?: readonly Size[] | undefined;

  /**
   * The width, in pixels, where the caller owns it. Stating one makes the width the caller's to
   * move, so a toolbar above the provider drives it through `onWidthChange`. Absent leaves it to
   * `defaultWidth` and the setter.
   */
  width?: number | undefined;
}

/**
 * Lays its subtree out for a stated width, or for the window until one is stated.
 *
 * @remarks
 *   A catalogue states a width to show a page as a phone sees it, and a specification states one to
 *   render a component at a size without stubbing `matchMedia`. The breakpoint hooks read the
 *   stated width before they read the window. The width is the caller's where the caller states
 *   `width` and the provider's own where it states `defaultWidth` or nothing, which is how every
 *   controllable component here takes a value.
 *   A style prop such as `{ base, md }` compiles to a media query and keeps following the window,
 *   because a query is matched by the browser and knows nothing about this. A block that has to
 *   follow the stated width is switched with `useBreakpointValue` instead.
 * @returns The subtree, with the viewport in scope.
 */
export function ViewportProvider({
  children,
  defaultWidth,
  onWidthChange,
  sizes,
  width: stated,
}: ViewportProviderProps): ReactElement {
  const [width, setWidth] = useControllableState<number | undefined>({
    defaultValue: defaultWidth,
    onChange: onWidthChange,
    value: stated,
  });

  return (
    <ViewportContext value={{ setWidth, sizes: sizes ?? sizesOf(), width }}>
      {children}
    </ViewportContext>
  );
}
