/**
 * Builds the card a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Aside } from "#card/aside.ts";
import { Content } from "#card/content.ts";
import { Description } from "#card/description.ts";
import { Footer } from "#card/footer.ts";
import { Header } from "#card/header.ts";
import { Indicator } from "#card/indicator.ts";
import { Media } from "#card/media.ts";
import { Root, type RootProps } from "#card/root.ts";
import { Title } from "#card/title.ts";

/**
 * Draws whatever a case wants measured inside the root that states the variants.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
export function carded(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Draws a whole card, so a case can read what every band did.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The nine parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root aria-labelledby="card-title" {...props}>
      <Media>
        <img alt="" src="/invoice.png" />
      </Media>
      <Header>
        <Indicator aria-hidden>●</Indicator>
        <Title id="card-title">Invoice 4821</Title>
        <Description>Issued on 2 September</Description>
        <Aside>
          <button type="button">More</button>
        </Aside>
      </Header>
      <Content>Three lines, one unbilled.</Content>
      <Footer>
        <button type="button">Send</button>
      </Footer>
    </Root>
  );
}
