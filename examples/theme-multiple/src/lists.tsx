/**
 * Draws the lists of the typography section: a numbered one, four with a marker a caller picks,
 * and a plain one whose marks the caller draws.
 *
 * @remarks
 *   Every marker is written as a literal, which is what the compiler extracts the rules for. The
 *   plain list draws its own mark in an indicator, which is hidden as a bullet is.
 */

import { type ReactElement } from "react";

import { List } from "@stealthscale/component-typography";

/**
 * Draws the six lists.
 */
export function Lists(): ReactElement {
  return (
    <>
      <List.Root as="ol" gap="sm">
        <List.Item>First</List.Item>
        <List.Item>Second</List.Item>
      </List.Root>
      <List.Root as="ol" gap="xs" marker="upper-roman">
        <List.Item>Roman, in capitals</List.Item>
        <List.Item>Roman, in capitals</List.Item>
      </List.Root>
      <List.Root as="ol" gap="xs" marker="lower-alpha">
        <List.Item>Alphabetic, in lower case</List.Item>
        <List.Item>Alphabetic, in lower case</List.Item>
      </List.Root>
      <List.Root as="ol" gap="xs" marker="leading-zero">
        <List.Item>Decimal, with a leading zero</List.Item>
        <List.Item>Decimal, with a leading zero</List.Item>
      </List.Root>
      <List.Root gap="xs" marker="dash">
        <List.Item>An en dash</List.Item>
        <List.Item>An en dash</List.Item>
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
    </>
  );
}
