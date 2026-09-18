/**
 * Keeps a form across a refresh: reads the draft kept for it, and writes the values and the step
 * the form reports.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";

import { localStore, type SettingStore } from "@stealthscale/settings";

import { type Draft, draftKey, parseDraft, schemaHash, withoutPaths, writeDraft } from "#draft.ts";
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
   * The draft kept for this form, as the store holds it now, or nothing where there is none. The
   * form starts from its `values`, and the step component opens on its `step`.
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
 * was read from, so a snapshot is the same object while the text is the same, and the step last
 * written is kept with them.
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
}

/**
 * Answers nothing, because a server has no store to read a draft from.
 */
function none(): undefined {
  return undefined;
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
 *   `format: "password"` or `x-persist: false` is never written. A draft typed against another
 *   schema is forgotten rather than applied.
 * @typeParam Values - The form's values.
 */
export function useDraft<Values>(options: DraftOptions): DraftHandle<Values> {
  const { app, id, schema, store = localStore() } = options;
  const key = draftKey(app, id);
  const hash = schemaHash(schema);
  const sensitive = sensitivePaths(schema);
  const kept = useRef<Kept<Values>>({ draft: undefined, step: undefined, text: null });

  /**
   * Reads the draft in the store now, parsing the text once per change to it.
   */
  const read = (): Draft<Values> | undefined => {
    const text = store.read(key);

    if (text !== kept.current.text) {
      kept.current.draft = text === null ? undefined : parseDraft<Values>(text, hash);
      kept.current.text = text;
    }

    return kept.current.draft;
  };

  /**
   * Listens for a change to the key, whichever document makes it.
   */
  const subscribe = (onChange: () => void): (() => void) => store.subscribe(key, onChange);

  const restored = useSyncExternalStore(subscribe, read, none);

  useEffect(() => {
    if (restored === undefined && store.read(key) !== null) store.clear(key);
  }, [key, restored, store]);

  /**
   * Writes the values and the step, less the paths that are never kept.
   */
  const write = (values: unknown, next?: string): void => {
    kept.current.step = next ?? kept.current.step ?? restored?.step;

    writeDraft(store, key, {
      hash,
      step: kept.current.step,
      values: withoutPaths(values, sensitive),
    });
  };

  /**
   * Forgets the draft.
   */
  const clear = (): void => {
    store.clear(key);
  };

  return { clear, restored, write };
}
