/**
 * Publishes the ways a person moves between places: the link, the trail of crumbs from the front
 * of a site, and the list of destinations a page is reached from. Each component binds a recipe a
 * theme can extend and draws nothing of its own. The recipes reach an application's compiler
 * through the preset under `./theme`, and the components reach its bundle through here. A
 * component with parts is published as a namespace, `Breadcrumb.Root` and `NavList.Root`.
 *
 * @packageDocumentation
 */

export * as Breadcrumb from "#breadcrumb/index.ts";
export * from "#link/index.ts";
export * as NavList from "#nav-list/index.ts";
