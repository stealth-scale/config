/**
 * Draws the catalogue's default frame: the rail on one side, the page inside it on the other.
 */

import { type ReactElement, type ReactNode } from "react";

import { Container, Stack } from "@stealthscale/component-layout";
import { type RouteDeclaration } from "@stealthscale/provider-router";

import { Rail } from "#catalogue/rail.tsx";

/**
 * Describes what the catalogue takes.
 */
export interface CatalogueProps {
  /**
   * The page the router matched, which the frame draws beside the rail.
   */
  children?: ReactNode | undefined;

  /**
   * Every route compiled into the catalogue, whatever declared them.
   */
  declarations: readonly RouteDeclaration[];
}

/**
 * Draws the rail beside whichever page the router matched.
 *
 * @remarks
 *   The simple frame, for an application that wants a rail and a page and nothing else. An
 *   application with a top bar, a search or a switcher of its own writes its own frame and hands it
 *   to `compileRoutes` under `FRAME`, using `Rail` directly. Nothing here is reached by any other
 *   part of the package.
 */
export function Catalogue({ children, declarations }: CatalogueProps): ReactElement {
  return (
    <Container size="full">
      <Stack align="flex-start" direction="row" gap="2xl">
        <Rail declarations={declarations} />
        {children}
      </Stack>
    </Container>
  );
}
