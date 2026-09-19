/**
 * Builds the shell a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { ViewportProvider } from "@stealthscale/provider-viewport";

import { Aside } from "#app-shell/aside.tsx";
import { Body } from "#app-shell/body.tsx";
import { Footer } from "#app-shell/footer.tsx";
import { Header } from "#app-shell/header.tsx";
import { Main } from "#app-shell/main.tsx";
import { Navbar, type NavbarProps } from "#app-shell/navbar.tsx";
import { Root, type RootProps } from "#app-shell/root.tsx";
import { Trigger } from "#app-shell/trigger.tsx";

/**
 * Draws whatever a case wants measured inside the column that hands down the variants.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the column.
 * @returns The column, holding it.
 */
export function shell(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Draws whatever a case wants measured inside the body, which is where a panel belongs.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the column.
 * @returns The column, holding the body, holding it.
 */
export function bodied(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Body>{children}</Body>
    </Root>
  );
}

/**
 * Draws a subtree at the width of a phone, which is what folds a panel out of the body.
 *
 * @param children - The shell under test.
 * @returns The subtree, laid out for a phone.
 */
export function narrowed(children: ReactNode): ReactElement {
  return <ViewportProvider defaultWidth={375}>{children}</ViewportProvider>;
}

/**
 * Draws a subtree at the width of a tablet, which holds the start side and folds the end side.
 *
 * @param children - The shell under test.
 * @returns The subtree, laid out for a tablet.
 */
export function tablet(children: ReactNode): ReactElement {
  return <ViewportProvider defaultWidth={820}>{children}</ViewportProvider>;
}

/**
 * Draws a whole shell, so a case can read how its bands and panels are placed.
 *
 * @param props - Whatever the case sets on the navigation panel.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: NavbarProps = {}): ReactElement {
  return (
    <Root>
      <Header>
        <Trigger>Navigation</Trigger>
      </Header>
      <Body>
        <Navbar {...props}>
          <a href="/invoices">Invoices</a>
        </Navbar>
        <Main>Billing</Main>
        <Aside aria-label="Detail">Totals</Aside>
      </Body>
      <Footer>Acme</Footer>
    </Root>
  );
}
