/**
 * Keeps settings for as long as the process runs, for a specification and for a server that
 * remembers nothing between requests.
 */

import { type SettingStore, watchers } from "#store.ts";

/**
 * Builds a store that holds its settings in memory.
 *
 * @remarks
 *   Each call builds a store of its own, so one specification never reads what another wrote.
 * @param initial - The settings the store starts with, keyed as they are written.
 * @returns The store, which reports every change to whatever is watching it.
 */
export function memoryStore(initial: Readonly<Record<string, string>> = {}): SettingStore {
  const held = new Map(Object.entries(initial));
  const watching = watchers();

  return {
    clear: (key) => {
      held.delete(key);
      watching.notify(key);
    },
    read: (key) => held.get(key) ?? null,
    subscribe: (key, onChange) => watching.watch(key, onChange),
    write: (key, value) => {
      held.set(key, value);
      watching.notify(key);
    },
  };
}
