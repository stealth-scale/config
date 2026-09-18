/**
 * Reads the languages a person's browser asks for.
 */

/**
 * Lists the languages a person's browser asks for, most wanted first.
 *
 * @returns The tags, or none on a server, where the application's own fallback then decides.
 */
export function browserLanguages(): readonly string[] {
  return globalThis.navigator?.languages ?? [];
}
