/**
 * Publishes the surfaces a page is built from: the card, a panel holding a picture, a header, a
 * content band and a footer. Each component binds a recipe a theme can extend and draws nothing of
 * its own. The recipes reach an application's compiler through the preset under `./theme`, and the
 * components reach its bundle through here. A component with parts is published as a namespace,
 * `Card.Root`.
 *
 * @packageDocumentation
 */

export * as Card from "#card/index.ts";
