/**
 * Publishes the surfaces a page is laid out on, each drawn by a slot recipe a theme can extend.
 *
 * @remarks
 *   The recipes reach an application's compiler through the preset under `./theme`, and the
 *   components reach its bundle through here. A component binds its recipe and draws nothing of
 *   its own, and a compound component is published as a namespace of its parts.
 * @packageDocumentation
 */

export * as Card from "#card/namespace.ts";
