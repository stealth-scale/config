/**
 * Draws the catalogue: the rail on one side, the page a reader chose on the other.
 */

import { type ReactElement, useState } from "react";

import { Container, Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";

import { grouped } from "#catalogue/grouped.ts";
import { Page } from "#catalogue/page.tsx";
import { Rail } from "#catalogue/rail.tsx";
import { type Indexed } from "#catalogue/types.ts";

/**
 * Describes what the catalogue takes.
 */
export interface CatalogueProps {
  /**
   * The pages to list, which is what `virtual:specimen-index` exports.
   *
   * @remarks
   *   Passed in rather than imported, so this package draws a catalogue without the build plugin
   *   in its own graph and a specification renders it without a build at all.
   */
  listed: readonly Indexed[];
}

/**
 * Draws the rail and the open page.
 *
 * @remarks
 *   The selection is state rather than an address, so a reader cannot yet link to a page. The
 *   router arrives with the rest of the chrome, and takes this state's place.
 */
export function Catalogue({ listed }: CatalogueProps): ReactElement {
  const [chosen, setChosen] = useState(listed[0]?.id ?? "");
  const entry = listed.find((page) => page.id === chosen);
  const { t } = useTranslation("specimen");

  return (
    <Container size="full">
      <Stack align="flex-start" direction="row" gap="2xl">
        <Rail chosen={chosen} groups={grouped(listed)} onChoose={setChosen} />
        {entry === undefined ? <Text tone="muted">{t("empty")}</Text> : <Page entry={entry} />}
      </Stack>
    </Container>
  );
}
