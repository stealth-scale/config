/**
 * Draws the rows left after what a person typed.
 *
 * @remarks
 *   The rows are the listbox's parts, so the roles, the highlight and what a screen reader says as
 *   it moves all come from that component. This one gathers the actions under their headings and
 *   draws the mark, the words and the keystroke of each.
 *   Whatever a caller puts inside stands where nothing matches, which is a `Command.Empty`.
 *   A group is named by its position rather than by its heading. The machine builds an element
 *   identifier from the name it is given, and a heading holding a space makes an identifier no
 *   selector can query, which is what a page reading the document falls over on.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { type CommandAction, gathered } from "#command/action.ts";
import { withContext } from "#command/context.ts";
import { useCommand } from "#command/state.ts";

/**
 * Draws the scroller at the size the panel states.
 */
const Scrolled = withContext("div", "list");

/**
 * Draws a row's keystroke at the end of it.
 */
const Struck = withContext("kbd", "shortcut");

/**
 * Describes what the list takes.
 */
export type ListProps = ComponentProps<typeof Scrolled>;

/**
 * Draws one row of the list.
 *
 * @param action - The action the row stands for.
 * @returns The row, holding its mark, its words and its keystroke.
 */
function row(action: CommandAction): ReactElement {
  return (
    <Listbox.Item item={action} key={action.value}>
      {action.icon}
      <Listbox.ItemText item={action}>{action.label}</Listbox.ItemText>
      {action.shortcut === undefined ? null : <Struck>{action.shortcut}</Struck>}
    </Listbox.Item>
  );
}

/**
 * Lists what is left, under the headings the actions name.
 *
 * @param props - The line standing where nothing matches, and everything a styled div takes.
 * @returns The scroller, holding the rows or the empty line.
 */
export function List({ children, ...rest }: ListProps): ReactElement {
  const palette = useCommand();
  const left = palette.collection.items;

  return (
    <Scrolled {...rest}>
      {left.length === 0 ? (
        children
      ) : (
        <Listbox.Content aria-label={palette.label}>
          {gathered(left).map(([heading, actions], index) => (
            <Listbox.ItemGroup id={`group-${String(index)}`} key={heading}>
              {heading === "" ? null : (
                <Listbox.ItemGroupLabel htmlFor={`group-${String(index)}`}>
                  {heading}
                </Listbox.ItemGroupLabel>
              )}
              {actions.map((action) => row(action))}
            </Listbox.ItemGroup>
          ))}
        </Listbox.Content>
      )}
    </Scrolled>
  );
}
