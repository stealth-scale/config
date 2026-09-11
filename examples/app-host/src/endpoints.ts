/**
 * Where the applications this one loads are deployed, worked out while it is running.
 */

import { registerRemotes } from "@module-federation/runtime";

/**
 * Where one application is deployed.
 */
export interface Endpoint {
  /**
   * The URL its entry is served from.
   */
  entry: string;

  /**
   * The name this application imports it under.
   */
  name: string;
}

/**
 * Reads an endpoint out of whatever the deployment answered with.
 *
 * @param held - One entry of the answer.
 * @returns The endpoint, or nothing where it is not one.
 */
function endpoint(held: unknown): Endpoint | undefined {
  if (typeof held !== "object" || held === null) return undefined;

  const entry: unknown = Reflect.get(held, "entry");
  const name: unknown = Reflect.get(held, "name");

  return typeof entry === "string" && typeof name === "string" ? { entry, name } : undefined;
}

/**
 * Reads where the other applications are from a file the deployment serves.
 *
 * This is the answer to a question the build cannot have: a URL compiled into the bundle is a build
 * that only runs in the environment it was built for, so promoting it from staging to production
 * means building it again and shipping an artefact nobody tested. Fetched instead, the same bundle
 * reads a different file in each environment and the artefact is the one that was tested.
 *
 * Served from this application's own origin, so it needs no configuration to find and no
 * cross-origin request to read.
 *
 * @param from - Where the deployment serves the file, relative to this application.
 * @returns Every endpoint it named, and nothing for an entry that is not one.
 * @throws Error Where the file is missing, which means the deployment is incomplete.
 */
export async function endpoints(from: string): Promise<readonly Endpoint[]> {
  const answered = await fetch(from);

  if (!answered.ok) {
    throw new Error(
      `endpoints(${from}) was answered ${String(answered.status)}. A deployment serves this file ` +
        "to say where the applications it loads are, and this one is serving none.",
    );
  }

  const held: unknown = await answered.json();

  return (Array.isArray(held) ? held : [])
    .map((one) => endpoint(one))
    .filter((one): one is Endpoint => one !== undefined);
}

/**
 * Tells the federation runtime where those applications are.
 *
 * Forced, because each of these names is already registered: the build declared it, with whatever
 * URL a developer's machine serves. That default is what this replaces, and replacing it is the
 * whole point — the artefact was built once and this is the only thing that differs between the
 * environments it is promoted through.
 *
 * Called before anything imports from one. A module imported from a remote whose URL has not been
 * replaced yet is fetched from the default, which on a deployment is a machine that is not there.
 *
 * @param held - The endpoints to register.
 */
export function join(held: readonly Endpoint[]): void {
  registerRemotes(
    held.map((one) => ({ entry: one.entry, name: one.name, type: "module" })),
    { force: true },
  );
}
