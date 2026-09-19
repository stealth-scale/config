/**
 * Builds the actions every command palette specification lists.
 */

import { type CommandAction } from "#command/action.ts";

/**
 * The actions every case starts from, two under a heading and one without.
 */
export const ACTIONS: readonly CommandAction[] = [
  { group: "Go to", label: "Invoices", value: "invoices" },
  { group: "Go to", label: "Reports", value: "reports" },
  { keywords: "add create", label: "New document", shortcut: "N", value: "new" },
];
