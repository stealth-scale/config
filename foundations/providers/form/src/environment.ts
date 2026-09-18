/**
 * Carries the engine, the renderers and the translator down the tree, and reads them back.
 */

import { createContext, useContext } from "react";

import { defaultEngine, type Engine } from "#engine.ts";
import { type Renderer } from "#renderer.ts";
import { type Translate, untranslated } from "#translate.ts";

/**
 * Describes what every form on a page reads from the provider above it.
 */
export interface FormEnvironment {
  /**
   * The engine that evaluates every schema.
   */
  readonly engine: Engine;

  /**
   * Lists the renderers in registration order.
   */
  readonly renderers: readonly Renderer[];

  /**
   * The translator every word goes through.
   */
  readonly translate: Translate;
}

/**
 * Carries what the nearest provider above settled on.
 *
 * @remarks
 *   Undefined outside a provider. The hook answers the defaults there, so a form on a page with
 *   no provider still works, with the default engine, no renderers and nothing translated.
 */
export const FormEnvironmentContext = createContext<FormEnvironment | undefined>(undefined);

/**
 * The environment a form reads where no provider is above it, built on first use.
 */
let fallback: FormEnvironment | undefined;

/**
 * Returns the environment a form reads where no provider is above it.
 */
export function defaultEnvironment(): FormEnvironment {
  fallback ??= { engine: defaultEngine(), renderers: [], translate: untranslated };

  return fallback;
}

/**
 * Reads the engine, the renderers and the translator in scope.
 *
 * @returns The nearest provider's environment, or the defaults where there is none.
 */
export function useFormEnvironment(): FormEnvironment {
  return useContext(FormEnvironmentContext) ?? defaultEnvironment();
}
