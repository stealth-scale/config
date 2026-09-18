import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Catalogues, NONE, useTranslation } from "@stealthscale/provider-i18n";

import { LocaleContext, type LocaleContextValue } from "#context.ts";
import { Translated } from "#translated.tsx";

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
      <Translated catalogues={catalogues}>{children}</Translated>
    </LocaleContext>,
  );
}

describe("Translated", () => {
  it("reads the catalogues in the locale in force", () => {
    mounted("nl", CATALOGUES, <Worded />);

    expect(screen.getByText("Opdrachten")).toBeTruthy();
  });

  it("reads the fallback language where the locale is the fallback", () => {
    mounted("en", CATALOGUES, <Worded />);

    expect(screen.getByText("Commands")).toBeTruthy();
  });

  it("renders the subtree untouched where it is given no catalogues", () => {
    mounted("en", undefined, <p>{"bare"}</p>);

    expect(screen.getByText("bare")).toBeTruthy();
  });
});
