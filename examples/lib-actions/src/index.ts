/**
 * Publishes the actions a page is driven with, each drawn by a recipe a theme can extend.
 *
 * @remarks
 *   The recipes reach an application's compiler through the preset under `./theme`, and the
 *   components reach its bundle through here. A component binds its recipe and draws nothing of
 *   its own.
 * @packageDocumentation
 */

export { Button, type ButtonProps } from "#button/button.ts";
