/**
 * Pulls in the ambient declarations the toolchain's build-time substitutions rely on.
 *
 * @remarks
 *   A reference directive only takes effect from a file the program already includes, so this file
 *   exists to be included. Removing it leaves every substituted identifier undeclared and the
 *   failure surfaces in the component that reads one rather than here.
 */

/// <reference types="@stealthscale/vite-config/globals" />
