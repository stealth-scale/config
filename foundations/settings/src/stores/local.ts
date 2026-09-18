/**
 * Keeps settings in the page's local storage, and follows what another tab writes.
 */

import { cache, type SettingStore, watchers } from "#store.ts";

/**
 * Finds the page's local storage, where the browser allows it.
 *
 * @remarks
 *   A browser that refuses storage throws on the read rather than answering nothing, which a
 *   private window and a blocked third-party frame both do. A refusal and an absence then come to
 *   the same thing: the setting reads its fallback and writes nowhere.
 * @returns The storage, or nothing on a server and where the browser refuses it.
 */
function available(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Builds the store, which is made once and shared.
 */
function build(): SettingStore {
  const watching = watchers();
  const held = cache();

  /**
   * Forgets what the cache holds for a key and tells whatever is watching it.
   */
  const changed = (key: null | string): void => {
    held.forget(key);
    watching.notify(key);
  };

  return {
    clear: (key) => {
      available()?.removeItem(key);
      changed(key);
    },
    read: (key) => held.through(key, () => available()?.getItem(key) ?? null),
    subscribe: (key, onChange) => {
      const stop = watching.watch(key, onChange);

      /**
       * Answers another tab, which reports a change to one key or a whole store cleared as a
       * change with no key at all.
       */
      const listener = (event: StorageEvent): void => {
        if (event.key === null || event.key === key) changed(event.key);
      };

      globalThis.addEventListener("storage", listener);

      return () => {
        stop();
        globalThis.removeEventListener("storage", listener);
      };
    },
    write: (key, value) => {
      available()?.setItem(key, value);
      changed(key);
    },
  };
}

/**
 * The one store, so that two settings share the readers watching a key.
 */
let held: SettingStore | undefined;

/**
 * Returns the store that keeps settings in the page's local storage.
 *
 * @remarks
 *   One store, however many times this is called, because two stores would keep two sets of
 *   readers and a write through one would leave the other showing what it wrote before. A change
 *   in another tab arrives as a `storage` event, and a change in this one arrives because the
 *   write tells its own readers: the browser fires that event everywhere except the document that
 *   made the change.
 * @returns The store, shared.
 */
export function localStore(): SettingStore {
  held ??= build();

  return held;
}
