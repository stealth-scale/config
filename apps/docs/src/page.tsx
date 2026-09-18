/**
 * Draws one page: its opening, then each scene under its title.
 */

import { type ReactElement, useEffect, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Heading, Text } from "@stealthscale/component-typography";
import { type Specimen } from "@stealthscale/specimen";

import { declared } from "#declared.ts";
import { type Indexed } from "#types.ts";

/**
 * Describes what a page takes.
 */
export interface PageProps {
  /**
   * The entry the index holds for it.
   */
  entry: Indexed;
}

/**
 * Loads the page's scenes and draws them.
 *
 * @remarks
 *   The module is loaded rather than imported, because the index reaches every page through a
 *   dynamic import and the bundler emits one chunk for each. Opening a page is the first time its
 *   components are fetched.
 */
export function Page({ entry }: PageProps): ReactElement {
  const [page, setPage] = useState<Specimen | undefined>();

  useEffect(() => {
    let watching = true;

    /**
     * Loads the module and keeps what it declares, unless the page has left the screen.
     */
    async function open(): Promise<void> {
      try {
        const module = await entry.load();

        if (watching) setPage(declared(module));
      } catch {
        if (watching) setPage(undefined);
      }
    }

    void open();

    return (): void => {
      watching = false;
    };
  }, [entry]);

  return (
    <Stack as="article" gap="2xl">
      <Stack gap="xs">
        <Heading size="xl">{entry.title}</Heading>
        {entry.about === "" ? undefined : <Text tone="muted">{entry.about}</Text>}
      </Stack>
      {(page?.scenes ?? []).map((scene) => (
        <Stack gap="sm" key={scene.title}>
          <Heading as="h2" size="sm">
            {scene.title}
          </Heading>
          {scene.about === undefined ? undefined : (
            <Text size="sm" tone="muted">
              {scene.about}
            </Text>
          )}
          <scene.draw />
        </Stack>
      ))}
    </Stack>
  );
}
