/**
 * Re-exports the compiler's diagnostic type through a module Node can load.
 *
 * @remarks
 *   A top-level `export type` is erased in full, so this module compiles to nothing, and a module
 *   that reads the type does not load the native compiler.
 */

export type { Diagnostic } from "@pandacss/compiler";
