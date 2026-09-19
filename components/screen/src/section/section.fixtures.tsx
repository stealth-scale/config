/**
 * Builds the section a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Actions } from "#section/actions.ts";
import { Body } from "#section/body.ts";
import { Description } from "#section/description.ts";
import { Footer } from "#section/footer.ts";
import { Header } from "#section/header.ts";
import { Root, type RootProps } from "#section/root.tsx";
import { Title } from "#section/title.tsx";

/**
 * Draws whatever a case wants measured inside the block that hands down the variants.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the block.
 * @returns The block, holding it.
 */
export function blocked(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Draws a whole section, so a case can read how its bands are placed.
 *
 * @param props - Whatever the case sets on the block.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Header>
        <Title>Billing</Title>
        <Description>How this workspace pays for what it uses.</Description>
        <Actions>
          <button type="button">Change plan</button>
        </Actions>
      </Header>
      <Body>The plan and the invoices.</Body>
      <Footer>
        <span>Billed monthly.</span>
        <button type="button">Cancel</button>
      </Footer>
    </Root>
  );
}
