/**
 * Publishes the components that are text: a heading, a paragraph, a snippet of code, a key a
 * reader is asked to press, a stressed run of words, a mark, a list and a quotation. Each
 * component binds a recipe a theme
 * can extend and draws nothing of its own. The recipes reach an application's compiler through
 * the preset under `./theme`, and the components reach its bundle through here. A component with
 * parts is published as a namespace, `List.Root` and `Blockquote.Content`.
 *
 * @packageDocumentation
 */

export * as Blockquote from "#blockquote/index.ts";
export * from "#code/index.ts";
export * from "#em/index.ts";
export * from "#heading/index.ts";
export * from "#icon/index.ts";
export * from "#kbd/index.ts";
export * as List from "#list/index.ts";
export * from "#text/index.ts";
