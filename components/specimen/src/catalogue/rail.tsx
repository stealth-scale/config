/**
 * Lists every route compiled into the catalogue that carries an entry.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type RouteDeclaration, RouteLink } from "@stealthscale/provider-router";

import { grouped } from "#catalogue/grouped.ts";

/**
 * Describes what the rail takes.
 */
export interface RailProps {
  /**
   * Every route compiled into the catalogue, whatever declared them.
   *
   * @remarks
   *   Declarations rather than the index, so a page an application wrote is listed beside a page
   *   the plugin found. The rail reads each one's entry and leaves out whatever carries none.
   */
  declarations: readonly RouteDeclaration[];
}

/**
 * Draws one heading per group and one link per page.
 *
 * @remarks
 *   A link rather than a button, so a page has an address a reader sends to somebody else. The
 *   router marks the open one, which is what `aria-current` is read off.
 */
export function Rail({ declarations }: RailProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <Stack aria-label={t("rail.label")} as="nav" gap="lg">
      {grouped(declarations).map((group) => (
        <Stack gap="xs" key={group.name}>
          <Text size="xs" tone="muted" weight="medium">
            {group.name === "" ? t("rail.ungrouped") : group.name}
          </Text>
          {group.pages.map((page) => (
            <RouteLink activeProps={{ "aria-current": "page" }} key={page.id} to={page.id}>
              {page.entry.label}
            </RouteLink>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
