/**
 * Writes the script that settles the first paint before the page draws.
 */

import { settingKey } from "@stealthscale/settings";
import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { COLOR_MODE_SETTING } from "#setting.ts";

/**
 * Writes the script an application inlines in its document head.
 *
 * @remarks
 *   Needed only where a person chose a mode that disagrees with their machine, and only where the
 *   choice is kept in local storage. Somebody who chose nothing is drawn correctly by the
 *   stylesheet alone, which follows the machine for a page carrying no attribute. An application
 *   rendered on a server keeps the choice in a cookie and writes the attribute itself, and needs
 *   none of this.
 *   The script does before the first paint what the provider does after it: reads the choice and
 *   writes the attribute. A provider runs after the page has drawn, which is one paint too late.
 *   Inline it as the whole body of a `script` element in the head.
 * @param app - The application's name, which has to match what the provider is given.
 * @returns The script's text, without the tags around it.
 */
export function colorModeScript(app: string): string {
  const key = settingKey(app, COLOR_MODE_SETTING);

  return [
    "(function(){try{",
    `var c=localStorage.getItem(${JSON.stringify(key)});`,
    `if(c==="dark"||c==="light"){`,
    `document.documentElement.setAttribute(${JSON.stringify(COLOR_MODE_ATTRIBUTE)},c)}`,
    "}catch(e){}})()",
  ].join("");
}
