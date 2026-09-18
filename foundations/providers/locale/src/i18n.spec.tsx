import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Catalogues, NONE, useTranslation } from "@stealthscale/provider-i18n";

import { LocaleContext, type LocaleContextValue } from "#context.ts";
import { I18nProvider } from "#i18n.tsx";

const CATALOGUES: Catalogues = {
  bundled: {
    en: { menu: { commands: "Commands" } },
    nl: { menu: { commands: "Opdrachten" } },
  },
  defaults: { menu: { commands: "Commands" } },
  fallback: "en",
  languages: ["en", "nl"],
  load: NONE.load,
  namespaces: ["menu"],
};

/**
 * Reads one word of the menu.
 *
 * @returns A paragraph with the word.
 */
function Worded(): ReactElement {
  return <p>{useTranslation("menu").t("commands")}</p>;
}

/**
 * Records the language of the instance in scope, to show one was mounted at all.
 *
 * @param seen - Where to record it.
 * @returns Nothing rendered.
 */
function Instance({ seen }: { readonly seen: string[] }): ReactElement {
  seen.push(useTranslation("menu").i18n.language);

  return <i />;
}

/**
 * Mounts a subtree under a locale and the catalogues.
 *
 * @param locale - The locale in force.
 * @param catalogues - The catalogues, or nothing to mount none.
 * @param children - The subtree.
 */
function mounted(locale: string, catalogues: Catalogues | undefined, children: ReactNode): void {
  const value: LocaleContextValue = {
    direction: "ltr",
    isPending: false,
    locale,
    locales: ["en", "nl"],
    setLocale: () => {},
  };

  render(
    <LocaleContext value={value}>
      <I18nProvider catalogues={catalogues}>{children}</I18nProvider>
    </LocaleContext>,
  );
}

describe("I18nProvider", () => {
  it("reads the catalogues in the locale in force", () => {
    mounted("nl", CATALOGUES, <Worded />);

    expect(screen.getByText("Opdrachten")).toBeTruthy();
  });

  it("reads the fallback language where the locale is the fallback", () => {
    mounted("en", CATALOGUES, <Worded />);

    expect(screen.getByText("Commands")).toBeTruthy();
  });

  it("resolves a key to itself where it is given no catalogues", () => {
    mounted("en", undefined, <Worded />);

    expect(screen.getByText("commands")).toBeTruthy();
  });

  it("mounts an instance where it is given no catalogues", () => {
    const seen: string[] = [];

    mounted("en", undefined, <Instance seen={seen} />);

    expect(seen).toEqual(["en"]);
  });
});
