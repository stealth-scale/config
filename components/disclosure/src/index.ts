/**
 * Publishes what is shown and hidden on the reader's say-so. Each component binds a recipe a theme
 * can extend and draws nothing of its own. The recipes reach an application's compiler through the
 * preset under `./theme`, and the components reach its bundle through here.
 *
 * @packageDocumentation
 */

export * as Collapsible from "#collapsible/index.ts";
export * as Menu from "#menu/index.ts";
export * as Popover from "#popover/index.ts";
export * as Tabs from "#tabs/index.ts";
export * as Tooltip from "#tooltip/index.ts";
