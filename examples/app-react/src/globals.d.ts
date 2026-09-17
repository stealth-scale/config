/**
 * Pulls in the ambient declarations the toolchain's build-time substitutions and the MDX documents
 * rely on.
 *
 * @remarks
 *   A reference directive only takes effect from a file the program already includes, so this file
 *   exists to be included. Removing it leaves every substituted identifier undeclared and every
 *   `.mdx` import unresolved, and the failure surfaces in the file that reads one rather than here.
 */

/// <reference types="@stealthscale/vite-config/globals" />
/// <reference types="@stealthscale/vite-config-react/mdx" />
