/**
 * Limits how far a selector reaches and how specific it becomes.
 */

/**
 * Caps a selector at no id and refuses a class qualified by an element.
 *
 * @remarks
 *   One id outranks any number of classes, so a stylesheet holding one starts
 *   an escalation the cascade cannot settle. Qualifying a class with a tag
 *   ties a style to the markup, and a component that later renders a different
 *   element loses the style without an error anywhere.
 */
export const SELECTOR = {
  "selector-max-id": 0,
  "selector-no-qualifying-type": true,
};
