/**
 * Arranges what is already there and draws nothing of its own: a stack, a grid, the measure a
 * page is read at, a frame round a picture, a line between things and the room left over. Each
 * component binds a recipe a theme can extend. The recipes reach an application's compiler
 * through the preset under `./theme`, and the components reach its bundle through here.
 *
 * A layout answers to the room it is in rather than to the width of the window: a grid fits as
 * many columns of one measure as it has space for, and a stack wraps when its children will not
 * sit in a row. Nothing here reads a breakpoint, and no page states one.
 *
 * @packageDocumentation
 */

export * from "#container/index.ts";
export * from "#divider/index.ts";
export * from "#frame/index.ts";
export * as Grid from "#grid/index.ts";
export * from "#spacer/index.ts";
export * from "#stack/index.ts";
