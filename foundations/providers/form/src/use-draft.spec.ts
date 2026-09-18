import { createElement, type ReactNode } from "react";
import { renderToString } from "react-dom/server";

import { FieldApi, FormApi } from "@tanstack/react-form";
import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { memoryStore, type SettingStore } from "@stealthscale/settings";

import { defaultsOf } from "#defaults.ts";
import { draftKey, schemaHash, writeDraft } from "#draft.ts";
import { type Schema } from "#schema.ts";
import { type DraftHandle, useDraft } from "#use-draft.ts";

interface Signup {
  name: string;
  password: string;
}

const signup: Schema = {
  properties: { name: { type: "string" }, password: { format: "password", type: "string" } },
  type: "object",
};

const KEY = draftKey("docs", "signup");
const HASH = schemaHash(signup);

/**
 * Keeps the signup form in the store given.
 */
function kept(store: SettingStore): RenderHookResult<DraftHandle<Signup>, unknown> {
  return renderHook(() => useDraft<Signup>({ app: "docs", id: "signup", schema: signup, store }));
}

/**
 * Reads the draft in the store, parsed.
 */
function stored(store: SettingStore): unknown {
  const text = store.read(KEY);

  return text === null ? undefined : JSON.parse(text);
}

/**
 * Reads the draft where it is rendered, which a server does without a store to read.
 */
function Reading({ store }: { readonly store: SettingStore }): ReactNode {
  const { restored } = useDraft<Signup>({ app: "docs", id: "signup", schema: signup, store });

  return restored === undefined ? "nothing" : "draft";
}

describe("useDraft", () => {
  it("answers nothing on a server whatever the store holds", () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: HASH, values: { name: "Roy" } });

    expect(renderToString(createElement(Reading, { store }))).toBe("nothing");
  });

  it("reads the draft kept for the schema and the form starts from its values", () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: HASH, step: "who", values: { name: "Roy" } });

    const { result } = kept(store);

    expect(result.current.restored).toStrictEqual({
      hash: HASH,
      step: "who",
      values: { name: "Roy" },
    });
    expect(defaultsOf<Signup>(signup, result.current.restored?.values)).toStrictEqual({
      name: "Roy",
      password: "",
    });
  });

  it("answers nothing where the store holds no draft", () => {
    expect(kept(memoryStore()).result.current.restored).toBeUndefined();
  });

  it("forgets a draft typed against another schema", () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: "00000000", values: { name: "Roy" } });

    const { result } = kept(store);

    expect(result.current.restored).toBeUndefined();
    expect(store.read(KEY)).toBeNull();
  });

  it("writes the values a form's change listener hands over", () => {
    const store = memoryStore();
    const { result } = kept(store);
    const form = new FormApi({
      defaultValues: { name: "", password: "" },
      listeners: {
        onChange: ({ formApi }): void => {
          result.current.write(formApi.state.values);
        },
      },
    });

    form.mount();
    new FieldApi({ form, name: "name" }).mount();
    act(() => {
      form.setFieldValue("name", "Roy");
    });

    expect(stored(store)).toStrictEqual({ hash: HASH, values: { name: "Roy" } });
    expect(result.current.restored?.values).toStrictEqual({ name: "Roy" });
  });

  it("never writes a password", () => {
    const store = memoryStore();
    const { result } = kept(store);

    act(() => {
      result.current.write({ name: "", password: "hunter2" });
    });

    expect(stored(store)).toStrictEqual({ hash: HASH, values: { name: "" } });
  });

  it("writes the step given and keeps it on the next write", () => {
    const store = memoryStore();
    const { result } = kept(store);

    act(() => {
      result.current.write({ name: "" }, "addresses");
    });

    expect(stored(store)).toStrictEqual({ hash: HASH, step: "addresses", values: { name: "" } });

    act(() => {
      result.current.write({ name: "Roy" });
    });

    expect(stored(store)).toStrictEqual({
      hash: HASH,
      step: "addresses",
      values: { name: "Roy" },
    });
    expect(result.current.restored?.step).toBe("addresses");
  });

  it("keeps the step a draft was read with", () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: HASH, step: "who", values: { name: "Roy" } });

    const { result } = kept(store);

    act(() => {
      result.current.write({ name: "Roy K" });
    });

    expect(stored(store)).toStrictEqual({ hash: HASH, step: "who", values: { name: "Roy K" } });
  });

  it("keeps the draft in the page's local storage where no store is given", () => {
    const { result } = renderHook(() =>
      useDraft<Signup>({ app: "docs", id: "signup", schema: signup }),
    );

    expect(() => {
      act(() => {
        result.current.write({ name: "Roy" });
        result.current.clear();
      });
    }).not.toThrow();
    expect(result.current.restored).toBeUndefined();
  });

  it("keeps nothing and reports nothing when given no options", () => {
    const { result } = renderHook(() => useDraft<Signup>());

    act(() => {
      result.current.write({ name: "Roy" }, "who");
    });

    expect(result.current.restored).toBeUndefined();
    expect(() => {
      result.current.clear();
    }).not.toThrow();
  });

  it("forgets the draft when cleared", () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: HASH, values: { name: "Roy" } });

    const { result } = kept(store);

    act(() => {
      result.current.clear();
    });

    expect(store.read(KEY)).toBeNull();
    expect(result.current.restored).toBeUndefined();
  });
});
