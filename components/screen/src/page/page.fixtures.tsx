/**
 * Builds the page a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Actions } from "#page/actions.ts";
import { Body } from "#page/body.ts";
import { Description } from "#page/description.ts";
import { Footer } from "#page/footer.tsx";
import { Header } from "#page/header.tsx";
import { Nav } from "#page/nav.tsx";
import { Root, type RootProps } from "#page/root.tsx";
import { Title } from "#page/title.ts";

/**
 * Draws whatever a case wants measured inside the column that hands down the variants.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the column.
 * @returns The column, holding it.
 */
export function paged(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Draws a whole page, so a case can read how its bands are placed.
 *
 * @param props - Whatever the case sets on the column.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Header>
        <Title>April</Title>
        <Actions>
          <button type="button">Download</button>
        </Actions>
        <Description>What this workspace was charged for in April.</Description>
      </Header>
      <Nav aria-label="Invoice">
        <span>Lines</span>
      </Nav>
      <Body>The lines of the invoice.</Body>
      <Footer>
        <span>Paid on 3 May.</span>
      </Footer>
    </Root>
  );
}
