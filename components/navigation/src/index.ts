/**
 * Publishes the ways a person moves between places: the link, and the trail of crumbs from the
 * front of a site. Each component binds a recipe a theme can extend and draws nothing of its own.
 * The recipes reach an application's compiler through the preset under `./theme`, and the
 * components reach its bundle through here.
 *
 * @packageDocumentation
 */

export * as Breadcrumb from "#breadcrumb/index.ts";
export * from "#link/index.ts";
