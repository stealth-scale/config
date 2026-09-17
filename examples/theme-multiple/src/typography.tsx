/**
 * Draws the typography package's components: two headings, a paragraph holding a snippet of code
 * and a key, a truncated line, two icons, two lists and a quotation.
 *
 * @remarks
 *   Every variant is written as a literal, which is what the compiler extracts the rules for. The
 *   second icon is labelled, so a screen reader names it, and the first is decoration and stays
 *   hidden. The plain list draws its own mark in an indicator, which is hidden as a bullet is.
 */

import { type ReactElement } from "react";

import {
  Blockquote,
  Code,
  Heading,
  Icon,
  Kbd,
  List,
  Text,
} from "@stealthscale/component-typography";
import { css } from "@stealthscale/theme";

/**
 * Lays the section out as a column.
 */
const section = css({ display: "flex", flexDirection: "column", gap: "gap.md" });

/**
 * Lays a row of marks out, wrapping where the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Draws the typography.
 */
export function Typography(): ReactElement {
  return (
    <section className={section}>
      <Heading>Typography</Heading>
      <Heading as="h3" size="md" tone="muted">
        A heading in the middle size
      </Heading>
      <Text>
        A paragraph in the body size, holding <Code>pnpm add</Code> as a snippet of code and{" "}
        <Kbd>Esc</Kbd> as a key a reader is asked to press.
      </Text>
      <Text size="sm" tone="muted" truncate>
        A small muted line cut to one line where the box ends, however long it runs on past the edge
        of the panel it sits in.
      </Text>
      <p className={row}>
        <Icon size="md" tone="warning" viewBox="0 0 24 24">
          <path d="M12 2 2 22h20Z" />
        </Icon>
        <Icon aria-hidden={false} aria-label="Loading" motion="spin" size="md" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" />
        </Icon>
      </p>
      <List.Root as="ol" gap="sm">
        <List.Item>First</List.Item>
        <List.Item>Second</List.Item>
      </List.Root>
      <List.Root variant="plain">
        <List.Item>
          <List.Indicator>✓</List.Indicator>
          Done
        </List.Item>
        <List.Item>
          <List.Indicator>✓</List.Indicator>
          Also done
        </List.Item>
      </List.Root>
      <Blockquote.Root variant="subtle">
        <Blockquote.Icon viewBox="0 0 24 24">
          <path d="M6 17h4l2-4V7H6v6h3zm8 0h4l2-4V7h-6v6h3z" />
        </Blockquote.Icon>
        <Blockquote.Content>A quotation set apart from the paragraph around it.</Blockquote.Content>
        <Blockquote.Caption>Someone, somewhere</Blockquote.Caption>
      </Blockquote.Root>
    </section>
  );
}
