/**
 * Builds the sidebar a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Content } from "#sidebar/content.ts";
import { Footer } from "#sidebar/footer.ts";
import { Header } from "#sidebar/header.ts";
import { NavLabel } from "#sidebar/nav-label.tsx";
import { Nav } from "#sidebar/nav.tsx";
import { Root, type RootProps } from "#sidebar/root.tsx";

/**
 * Draws whatever a case wants measured inside the column that hands down the variants.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the column.
 * @returns The column, holding it.
 */
export function aside(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Draws whatever a case wants measured inside a block of destinations.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the column.
 * @returns The column, holding the block, holding it.
 */
export function blocked(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Nav>{children}</Nav>
    </Root>
  );
}

/**
 * Draws a whole sidebar, so a case can read how its bands are placed.
 *
 * @param props - Whatever the case sets on the column.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Header>Acme</Header>
      <Content>
        <Nav>
          <NavLabel>Workspace</NavLabel>
          <a href="/invoices">Invoices</a>
        </Nav>
      </Content>
      <Footer>Account</Footer>
    </Root>
  );
}
