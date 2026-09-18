/**
 * Publishes what a person fills in: the text field, the field with a mark at one end or both, and
 * the search field with a control that empties it. Each component binds a recipe a theme can
 * extend and draws nothing of its own. The recipes reach an application's compiler through the
 * preset under `./theme`, and the components reach its bundle through here. A component with parts
 * is published as a namespace, `InputGroup.Root`.
 *
 * @packageDocumentation
 */

export * as Field from "#field/index.ts";
export * as Fieldset from "#fieldset/index.ts";
export * as InputGroup from "#input-group/index.ts";
export * from "#input/index.ts";
export * from "#search-input/index.ts";
