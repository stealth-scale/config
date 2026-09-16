/**
 * Declares the `*.mdx` module and types the elements a document renders against React's own JSX.
 *
 * @remarks
 *   A reference directive only takes effect from a file the program already includes, so a package
 *   pulls this file in from its own `globals.d.ts`. The first directive is what makes an `.mdx`
 *   import resolve at all. The augmentation below it is what makes `MDXComponents` check a
 *   component against the element it replaces: `@types/mdx` reads a global `JSX` namespace, and
 *   `@types/react` 19 declares none.
 */

/// <reference types="mdx" />

import * as React from "react";

declare module "mdx/types.js" {
  export import JSX = React.JSX;
}
