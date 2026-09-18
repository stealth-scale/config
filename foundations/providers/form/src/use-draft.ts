/**
 * Keeps a form across a refresh: reads the draft kept for it, and writes the values and the step
 * the form reports.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";

import { localStore, type SettingStore } from "@stealthscale/settings";

import { type Draft, draftKey, parseDraft, schemaHash, withoutPaths } from "#draft.ts";
import { type Schema } from "#schema.ts";
import { sensitivePaths } from "#walk.ts";

/**
 * Describes how a form is kept across a refresh.
 */
export interface DraftOptions {
  /**
   * The application the draft is kept under, as a setting is.
   */
  readonly app: string;

  /**
   * The form's identifier, which the key is built from.
   */
  readonly id: string;

  /**
   * The schema the values are typed against. A draft typed against another schema is dropped.
   */
  readonly schema: Schema;

  /**
   * Where the draft is kept. The page's local storage where this is absent.
   */
  readonly store?: SettingStore | undefined;
}

/**
 * Describes what a form keeping a draft is handed.
 *
 * @typeParam Values - The form's values.
 */
export interface DraftHandle<Values> {
  /**
   * Forgets the draft, which a successful submit does.
   */
  readonly clear: () => void;

  /**
   * The draft kept for this form when it was read, or nothing where there is none, followed as
   * another document changes it. The form starts from its `values`, and the step component opens
   * on its `step`. What this handle writes itself is not read back.
   */
  readonly restored: Draft<Values> | undefined;

  /**
   * Writes the values, and the step where one is given. The step last written stays otherwise.
   * The form's change listener reports the values, and the step component reports the step.
   */
  readonly write: (values: unknown, step?: string) => void;
}

/**
 * Describes what the hook keeps between renders. The draft last read is kept beside the text it
 * was read from, so a snapshot is the same object while the text is the same, and the step and
 * the text last written are kept with them.
 */
interface Kept<Values> {
  /**
   * The draft the text parsed to, or nothing.
   */
  draft: Draft<Values> | undefined;

  /**
   * The step last written, or nothing before anybody wrote one.
   */
  step: string | undefined;

  /**
   * The text the draft was parsed from, or null where the store held none.
   */
  text: null | string;

  /**
   * The text this handle last wrote, or nothing before it wrote any and after it cleared the
   * draft.
   */
  written: string | undefined;
}

/**
 * Describes how a reader listens for a change to one key of one store.
 */
type Subscribe = (onChange: () => void) => () => void;

/**
 * Answers nothing, because a server has no store to read a draft from.
 */
function none(): undefined {
  return undefined;
}

/**
 * Keeps nothing and reports nothing, for a form that keeps no draft.
 */
const IDLE: SettingStore = { clear: none, read: () => null, subscribe: () => none, write: none };

/**
 * The listener built for each key, by the store it listens to.
 *
 * @remarks
 *   Built once per store and key rather than per render, because a reader is subscribed by the
 *   identity of the function it was given, and a fresh one each render would drop and rebuild
 *   the subscription each render.
 */
const listeners = new WeakMap<SettingStore, Map<string, Subscribe>>();

/**
 * Returns the listener for one key of one store, building it on first use.
 */
function subscriptionTo(store: SettingStore, key: string): Subscribe {
  const held = listeners.get(store) ?? new Map<string, Subscribe>();

  listeners.set(store, held);

  const already = held.get(key);

  if (already !== undefined) return already;

  /**
   * Listens for a change to the key, whichever document makes it.
   */
  const built: Subscribe = (onChange) => store.subscribe(key, onChange);

  held.set(key, built);

  return built;
}

/**
 * Keeps a form across a refresh.
 *
 * @remarks
 *   The draft is read through `useSyncExternalStore`, whose server snapshot is nothing, so a
 *   server-rendered page and its hydration agree and the form receives the draft in the render
 *   after. The form starts from `restored.values` written over the schema's defaults, which the
 *   library applies to an untouched form when its default values change. The form's own change
 *   listener writes the draft, debounced by the library, and a value at a path the schema marks
 *   `format: "password"` or `x-persist: false` is never written. A write of this handle's own is
 *   not read back, so the form's values reaching the store does not re-render the form: what was
 *   restored is what the form started from, and a change from another document still arrives. A
 *   draft typed against another schema is forgotten rather than applied. Given no options, the
 *   hook keeps nothing and reports nothing, so a hook that may or may not keep a draft calls it
 *   on every render.
 * @typeParam Values - The form's values.
 */
export function useDraft<Values>(options?: DraftOptions): DraftHandle<Values> {
  const {
    app = "",
    id = "",
    schema = {},
    store = options === undefined ? IDLE : localStore(),
  } = options ?? {};
  const key = draftKey(app, id);
  const hash = schemaHash(schema);
  const sensitive = sensitivePaths(schema);
  const kept = useRef<Kept<Values>>({
    draft: undefined,
    step: undefined,
    text: null,
    written: undefined,
  });

  /**
   * Reads the draft in the store now, parsing the text once per change to it, and passing over
   * the text this handle wrote itself.
   */
  const read = (): Draft<Values> | undefined => {
    const text = store.read(key);

    if (text !== kept.current.text && text !== kept.current.written) {
      kept.current.draft = text === null ? undefined : parseDraft<Values>(text, hash);
      kept.current.text = text;
    }

    return kept.current.draft;
  };

  const restored = useSyncExternalStore(subscriptionTo(store, key), read, none);

  useEffect(() => {
    if (restored === undefined && store.read(key) !== null) store.clear(key);
  }, [key, restored, store]);

  /**
   * Writes the values and the step, less the paths that are never kept.
   */
  const write = (values: unknown, next?: string): void => {
    kept.current.step = next ?? kept.current.step ?? restored?.step;

    const text = JSON.stringify({
      hash,
      step: kept.current.step,
      values: withoutPaths(values, sensitive),
    });

    kept.current.written = text;
    store.write(key, text);
  };

  /**
   * Forgets the draft.
   */
  const clear = (): void => {
    kept.current.written = undefined;
    store.clear(key);
  };

  return { clear, restored, write };
}
