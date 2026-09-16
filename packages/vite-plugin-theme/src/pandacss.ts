/**
 * Re-exports the compiler's types through a module Node can load.
 *
 * @remarks
 *   `@pandacss/types` publishes declarations and nothing else, so an inline type import of it keeps
 *   a runtime import of a declaration file, which Node refuses. A top-level `export type` is erased
 *   in full, so this module compiles to nothing and the import that reaches it resolves to a real
 *   module. The compiler's own diagnostic and change types are re-exported the same way, so a
 *   module that only reads them does not load the native compiler.
 */

export type { Diagnostic, SourceChange } from "@pandacss/compiler";
export type {
  Config,
  Preset,
  StaticCssOptions,
  StylesheetLayers,
  ThemeVariant,
} from "@pandacss/types";
