/**
 * Fixes what a store owes a setting: how to read it, write it, forget it, and say when it changed.
 *
 * @remarks
 *   The browser's own `Storage` interface has no notification, which is why a setting built on it
 *   alone cannot tell one tab what another chose. Asking every store for `subscribe` makes that a
 *   property of the design rather than something each caller patches.
 */

/**
 * Describes where a setting is kept and how a reader learns that it changed.
 */
export interface SettingStore {
  /**
   * Forgets a value, so the next read answers the fallback.
   */
  clear: (key: string) => void;

  /**
   * Reads the text a key holds.
   *
   * @returns The text, or `null` where nothing is written and where the store is unreachable.
   */
  read: (key: string) => null | string;

  /**
   * Calls back whenever the key changes, whichever document changed it.
   *
   * @returns How to stop listening.
   */
  subscribe: (key: string, onChange: () => void) => () => void;

  /**
   * Writes a value, and tells the readers watching this document.
   */
  write: (key: string, value: string) => void;
}

/**
 * Describes the callbacks watching each key, which a store keeps so that a write tells the
 * document that made it.
 */
export interface Watchers {
  /**
   * Calls back everything watching a key, or everything at all where the key is `null`.
   *
   * @param key - The key that changed, or `null` where every key did, which is what clearing a
   *   whole store reports.
   */
  notify: (key: null | string) => void;

  /**
   * Adds a callback for one key.
   *
   * @returns How to remove it.
   */
  watch: (key: string, onChange: () => void) => () => void;
}

/**
 * Describes a store's memory of what it last read, which is what keeps a render cheap.
 */
export interface Cache {
  /**
   * Forgets a key, or every key where the key is `null`, so the next read goes to the store.
   */
  forget: (key: null | string) => void;

  /**
   * Answers what was last read for a key, calling the reader it is given where the cache holds
   * nothing for that key.
   */
  through: (key: string, read: () => null | string) => null | string;
}

/**
 * Builds a store's memory of what it last read.
 *
 * @remarks
 *   React calls a snapshot more than once per render and once per component, and both backing
 *   stores are slow to ask: reading a cookie parses every cookie on the origin, which measured at
 *   458 nanoseconds against 6 for a cached answer. Every way a key changes runs through the same
 *   store, so forgetting a key when it is told is enough to keep the answer true.
 *   What is held outlives a backing store going away. A browser that starts refusing storage
 *   part-way through a visit keeps answering what it last read for a key it already read, which no
 *   browser does and which costs nothing to allow.
 * @returns How to read through the cache and how to forget what it holds.
 */
export function cache(): Cache {
  const held = new Map<string, null | string>();

  return {
    forget: (key) => {
      if (key === null) held.clear();
      else held.delete(key);
    },
    through: (key, read) => {
      if (held.has(key)) return held.get(key) ?? null;

      const found = read();

      held.set(key, found);

      return found;
    },
  };
}

/**
 * Builds the set of callbacks a store tells when one of its keys changes.
 *
 * @remarks
 *   A store keeps one of these because no browser event fires in the document that made the
 *   change. Without it a write would reach every other tab and not the one the person is looking
 *   at.
 * @returns How to watch a key and how to tell whatever is watching one.
 */
export function watchers(): Watchers {
  const held = new Map<string, Set<() => void>>();

  return {
    notify: (key) => {
      const reached = key === null ? [...held.values()] : [held.get(key) ?? new Set<() => void>()];

      for (const watching of reached) for (const onChange of watching) onChange();
    },
    watch: (key, onChange) => {
      const watching = held.get(key) ?? new Set<() => void>();

      watching.add(onChange);
      held.set(key, watching);

      return () => {
        watching.delete(onChange);
      };
    },
  };
}
