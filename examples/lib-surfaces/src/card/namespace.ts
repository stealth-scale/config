/**
 * Composes the card: `Card.Root` holding `Card.Header`, `Card.Content` and `Card.Footer`, in
 * that order.
 *
 * @remarks
 *   The root takes the look and the size. The bands take nothing of the recipe's, and each is
 *   drawn in the variants the root was given.
 */

export { Content, type ContentProps } from "#card/content.ts";
export { Footer, type FooterProps } from "#card/footer.ts";
export { Header, type HeaderProps } from "#card/header.ts";
export { Root, type RootProps } from "#card/root.ts";
