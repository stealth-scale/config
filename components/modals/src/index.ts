/**
 * Publishes what the page waits for: a dialog, a drawer, a palette, a tour. Each component binds a
 * recipe a theme can extend and draws nothing of its own. The recipes reach an application's
 * compiler through the preset under `./theme`, and the components reach its bundle through here.
 *
 * @packageDocumentation
 */

export * as Command from "#command/index.ts";
