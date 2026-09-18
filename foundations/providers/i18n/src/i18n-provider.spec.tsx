import { type ReactElement, Suspense } from "react";

import { render, screen } from "@testing-library/react";
import { type i18n as Instance } from "i18next";
import { useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";

import { SMALL } from "#catalogues.fixtures.ts";
import { I18nProvider } from "#i18n-provider.tsx";

/**
 * Reads two words of the overlays, the way a component does.
 *
 * @returns One line.
 */
function Words(): ReactElement {
  const { t } = useTranslation("overlays");

  return (
    <p>
      {t("commands")} / {t("nested.close", { what: "it" })}
    </p>
  );
}

/**
 * Notes which instance is in scope, every time it renders.
 *
 * @param props - The list to note it in.
 * @param props.seen - The list.
 * @returns Nothing drawn.
 */
function Noting({ seen }: { readonly seen: Instance[] }): null {
  seen.push(useTranslation("overlays").i18n);

  return null;
}

/**
 * Renders the words in a locale, under a boundary for the language being fetched.
 *
 * @param locale - The locale to read in.
 * @returns What was rendered.
 */
function drawn(locale: string): ReturnType<typeof render> {
  return render(
    <I18nProvider catalogues={SMALL} locale={locale}>
      <Suspense fallback={<p>{"fetching"}</p>}>
        <Words />
      </Suspense>
    </I18nProvider>,
  );
}

describe("I18nProvider", () => {
  it("renders the fallback words on the first paint", () => {
    drawn("en");

    expect(screen.getByText("Commands / Close it")).toBeTruthy();
  });

  it("renders the fallback words for a locale with no catalogue", () => {
    drawn("en-US");

    expect(screen.getByText("Commands / Close it")).toBeTruthy();
  });

  it("renders another language after it is fetched", async () => {
    drawn("nl");

    expect(await screen.findByText("Opdrachten / Sluit it")).toBeTruthy();
  });

  it("changes the words when locale changes", async () => {
    const { rerender } = drawn("en");

    rerender(
      <I18nProvider catalogues={SMALL} locale="nl">
        <Suspense fallback={<p>{"fetching"}</p>}>
          <Words />
        </Suspense>
      </I18nProvider>,
    );

    expect(await screen.findByText("Opdrachten / Sluit it")).toBeTruthy();
  });

  it("creates the instance once across rerenders", () => {
    const seen: Instance[] = [];
    const noting = <Noting seen={seen} />;
    const { rerender } = render(
      <I18nProvider catalogues={SMALL} locale="en">
        {noting}
      </I18nProvider>,
    );

    rerender(
      <I18nProvider catalogues={SMALL} locale="en">
        {noting}
      </I18nProvider>,
    );

    expect(seen).toHaveLength(1);
  });
});
