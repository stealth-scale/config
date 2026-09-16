/**
 * Finds the packages on an application's dependency graph that publish a preset, and the workspace
 * packages whose source the compiler scans.
 *
 * @remarks
 *   Both lists are read off the graph rather than stated. An application that names the packages
 *   it draws with has said so in its manifest, and a second list written as paths would be one
 *   more thing to keep in step.
 */

import { relative, sep } from "node:path";

import { dependencies, type Dependency } from "@stealthscale/vite-plugin-base";

import { PRESET_SUBPATH } from "#options.ts";

/**
 * Marks a directory that belongs to an installed package rather than to the workspace.
 */
const VENDOR = `${sep}node_modules${sep}`;

/**
 * Describes a package contributing a preset to an application.
 */
export interface Contributor {
  /**
   * The package's directory, absolute.
   */
  at: string;

  /**
   * The package's name, which its preset is imported under as `<name>/theme`.
   */
  name: string;
}

/**
 * Reports whether a package publishes the preset subpath.
 */
function publishes(one: Dependency): boolean {
  const exports = one.manifest["exports"];

  return typeof exports === "object" && exports !== null && PRESET_SUBPATH in exports;
}

/**
 * Lists every package on the application's graph that publishes a preset, the system package
 * first and each other package after the packages it depends on.
 *
 * @remarks
 *   The system package goes first whatever the graph says. Every recipe is written against its
 *   vocabulary, and a component package names it as a peer rather than a dependency, so nothing
 *   in the graph puts it where it belongs. The order decides the outcome: where two presets state
 *   the same thing, the one installed later wins.
 */
export function contributors(root: string, systemPackage: string): readonly Contributor[] {
  const found = dependencies(root)
    .filter((one) => publishes(one))
    .map((one) => ({ at: one.at, name: one.named }));

  return [
    ...found.filter((one) => one.name === systemPackage),
    ...found.filter((one) => one.name !== systemPackage),
  ];
}

/**
 * Lists a glob for the source of every workspace package the application depends on, relative to
 * the application, sorted.
 *
 * @remarks
 *   A style prop is resolved when the stylesheet is compiled, so a prop the compiler never read is
 *   a class with no rule behind it. The props are written in the packages the application draws
 *   with, so their source is scanned beside the application's own. An installed package is left
 *   out: what ships in one is compiled JavaScript whose props were resolved before it was
 *   published.
 */
export function workspaceSources(root: string): readonly string[] {
  return dependencies(root)
    .filter((one) => !one.at.includes(VENDOR))
    .map((one) => `${relative(root, one.at)}/src/**/*.{ts,tsx}`.replaceAll(sep, "/"))
    .toSorted();
}
