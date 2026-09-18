/**
 * Lists the components that lay a generated form out.
 */

import { type Layouts } from "@stealthscale/provider-form";

import { Cell } from "#cell.tsx";
import { Group } from "#group.tsx";
import { Item } from "#item.tsx";
import { Step } from "#step.tsx";

/**
 * The layouts a generated form is drawn with: a cell around a field, a group, an item of a
 * repeat group, and a step.
 */
export const layouts: Layouts = { Cell, Group, Item, Step };
