/**
 * Lists every page the index found, under the group each one declares.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";

import { type Group } from "#grouped.ts";

/**
 * Describes what the rail takes.
 */
export interface RailProps {
  /**
   * The identifier of the page on screen.
   */
  chosen: string;

  /**
   * The groups, in the order they are listed.
   */
  groups: readonly Group[];

  /**
   * Opens a page.
   */
  onChoose: (id: string) => void;
}

/**
 * Draws one heading per group and one button per page.
 *
 * @remarks
 *   A button rather than a link, because the catalogue keeps its selection in state and routes
 *   nothing yet. The element changes with the router, and the rail's shape does not.
 */
export function Rail({ chosen, groups, onChoose }: RailProps): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Stack aria-label={t("rail.label")} as="nav" gap="lg">
      {groups.map((group) => (
        <Stack gap="xs" key={group.name}>
          <Text size="xs" tone="muted" weight="medium">
            {group.name === "" ? t("rail.ungrouped") : group.name}
          </Text>
          {group.pages.map((page) => (
            <Button
              aria-current={page.id === chosen ? "page" : undefined}
              key={page.id}
              onClick={() => {
                onChoose(page.id);
              }}
              size="sm"
              variant={page.id === chosen ? "subtle" : "plain"}
            >
              {page.title}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
