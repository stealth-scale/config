/**
 * Puts the engine, the renderers and the translator in scope for every form below.
 */

import { type ReactElement, type ReactNode, useMemo } from "react";

import { type Engine } from "#engine.ts";
import { type FormEnvironment, FormEnvironmentContext, useFormEnvironment } from "#environment.ts";
import { type Renderer } from "#renderer.ts";
import { type Translate } from "#translate.ts";

/**
 * Describes what {@link FormProvider} is given.
 */
export interface FormProviderProps {
  /**
   * The page whose forms read the environment.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The engine that evaluates every schema. The provider above, or the default engine, where this
   * is absent.
   */
  readonly engine?: Engine | undefined;

  /**
   * The renderers, in registration order: the defaults, then the application's, then a plugin's.
   * The provider above's, or none, where this is absent.
   */
  readonly renderers?: readonly Renderer[] | undefined;

  /**
   * The translator every word goes through, in the shape of i18next's `t`. The provider above's,
   * or one that answers the default for every key, where this is absent.
   */
  readonly translate?: Translate | undefined;
}

/**
 * Puts the engine, the renderers and the translator in scope for every form below.
 *
 * @remarks
 *   A provider states only what it changes. Whatever it leaves out is read from the provider above
 *   it, or from the defaults at the root, so a specification wraps one form in a provider that
 *   states a translator alone. The value is kept while the props and the environment above stay
 *   the same, so a reader is not re-rendered by a fresh object.
 * @returns The page, with the environment in scope.
 */
export function FormProvider({
  children,
  engine,
  renderers,
  translate,
}: FormProviderProps): ReactElement {
  const above = useFormEnvironment();
  const value = useMemo(
    (): FormEnvironment => ({
      engine: engine ?? above.engine,
      renderers: renderers ?? above.renderers,
      translate: translate ?? above.translate,
    }),
    [above, engine, renderers, translate],
  );

  return <FormEnvironmentContext value={value}>{children}</FormEnvironmentContext>;
}
