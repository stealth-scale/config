/**
 * Pulls in the ambient declarations the toolchain and the specimen index rely on.
 *
 * @remarks
 *   A reference directive only takes effect from a file the program already includes, so this file
 *   exists to be included. Removing it leaves every virtual specimen module unresolved, and the
 *   failure surfaces in the file that imports one rather than here.
 */

/// <reference types="@stealthscale/vite-config/globals" />
/// <reference types="@stealthscale/vite-plugin-specimen/client" />
