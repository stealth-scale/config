/**
 * Puts a locale in scope, writes it onto the document, and remembers what a person chose.
 */

import { type ReactElement, type ReactNode, useCallback, useEffect, useMemo } from "react";

import { documentOf, useRootNode } from "@stealthscale/provider-environment";
import { type SettingStore, useSetting } from "@stealthscale/settings";

import { LocaleContext, type LocaleContextValue } from "#context.ts";
import { localeSetting } from "#setting.ts";
import { directionOf } from "#tags.ts";

/**
 * Describes what {@link LocaleProvider} is given.
 */
export interface LocaleProviderProps {
  /**
   * The application the choice is remembered under, so two applications on one origin keep their
   * own.
   */
  readonly app: string;

  /**
   * The page read in the locale.
   */
  readonly children?: ReactNode | undefined;

  /**
   * True while whatever drives the locale is still switching it, which a switcher shows rather than
   * a blank. Only meaningful beside `locale`, because the provider's own switch is immediate.
   */
  readonly isPending?: boolean | undefined;

  /**
   * The locale to read in, where something above decides it. The provider decides where this is
   * absent: what a person chose, else the best offer for what their browser asks for, else the
   * first.
   */
  readonly locale?: string | undefined;

  /**
   * The locales the application offers, as BCP 47 tags, the first being its fallback. The locale in
   * force is always one of these.
   */
  readonly locales: readonly [string, ...string[]];

  /**
   * Hears that a person asked for another locale, where something above decides it. Given this, the
   * provider changes nothing and remembers nothing itself.
   */
  readonly onLocaleChange?: ((locale: string) => void) | undefined;

  /**
   * Where to keep the choice. The page's local storage where this is absent.
   */
  readonly store?: SettingStore | undefined;
}

/**
 * Puts a locale in scope for everything below, and writes it onto the document root.
 *
 * @remarks
 *   On its own the provider decides the locale and remembers a person's choice under the
 *   application's name. Given `locale` and `onLocaleChange` it reads in what it is told and passes
 *   a choice up instead, so whatever drives it can switch the locale and the words that follow
 *   together. `lang` and `dir` go onto the document root because nothing else writes them, and the
 *   stylesheet's logical properties, a screen reader's voice and the browser's own controls all
 *   read them there. A component that positions itself by direction reads `useLocale().direction`
 *   and hands `dir` to its machine.
 * @param props - The props. `LocaleProviderProps` documents every member.
 */
export function LocaleProvider({
  app,
  children,
  isPending = false,
  locale: driven,
  locales,
  onLocaleChange,
  store,
}: LocaleProviderProps): ReactElement {
  const setting = useMemo(() => localeSetting(locales, store), [locales, store]);
  const [chosen, setChosen] = useSetting(app, setting);
  const locale = driven ?? chosen;
  const getRootNode = useRootNode();
  const setLocale = useCallback(
    (next: string) => {
      if (!locales.includes(next)) return;
      if (onLocaleChange === undefined) setChosen(next);
      else onLocaleChange(next);
    },
    [locales, onLocaleChange, setChosen],
  );
  const value = useMemo<LocaleContextValue>(
    () => ({ direction: directionOf(locale), isPending, locale, locales, setLocale }),
    [isPending, locale, locales, setLocale],
  );

  useEffect(() => {
    const root = documentOf(getRootNode()).documentElement;

    root.lang = value.locale;
    root.dir = value.direction;
  }, [getRootNode, value.direction, value.locale]);

  return <LocaleContext value={value}>{children}</LocaleContext>;
}
