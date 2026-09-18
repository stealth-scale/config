/**
 * Publishes the foundation every form is built on: the contexts a bound field and a bound form
 * share, the engine that evaluates a schema and wraps it as the Standard Schema the form library
 * validates with, the defaults and message identifiers derived from a schema, how a form is drawn
 * as data, the provider that puts the engine, the renderers and the translator in scope, and the
 * draft that keeps a form across a refresh.
 *
 * @packageDocumentation
 */

export { catalogue, type CatalogueEntry } from "#catalogue.ts";
export { fieldContext, formContext, useFieldContext, useFormContext } from "#contexts.ts";
export { defaultsOf } from "#defaults.ts";
export { type Draft, draftKey, parseDraft, schemaHash, withoutPaths, writeDraft } from "#draft.ts";
export {
  createEngine,
  defaultEngine,
  type Engine,
  type EngineOptions,
  type Format,
  type Keyword,
} from "#engine.ts";
export { defaultEnvironment, type FormEnvironment, useFormEnvironment } from "#environment.ts";
export { focusFirstInvalid, formDefaults, type Invalidated } from "#form-defaults.ts";
export { type Identifiers, identifiers } from "#identifiers.ts";
export { type Issue } from "#issues.ts";
export { collapse, type Path, type Segment } from "#path.ts";
export {
  FORM,
  KEYWORDS,
  members,
  presentationOf,
  unplaced,
  validatePresentation,
} from "#presentation-of.ts";
export {
  type Field,
  type Group,
  isGroup,
  type Member,
  type Presentation,
  type Step,
  type Steps,
} from "#presentation.ts";
export { FormProvider, type FormProviderProps } from "#provider.tsx";
export {
  byControl,
  RANK,
  type Renderer,
  rendererFor,
  type RendererProps,
  type Suits,
} from "#renderer.ts";
export { DRAFT, type Schema, schemaOf } from "#schema.ts";
export { standardOf } from "#standard.ts";
export * from "#tanstack.ts";
export {
  type Translate,
  translateFrom,
  type TranslateOptions,
  untranslated,
  worded,
} from "#translate.ts";
export { type DraftHandle, type DraftOptions, useDraft } from "#use-draft.ts";
export { isSchema, PERSIST, sensitivePaths } from "#walk.ts";
