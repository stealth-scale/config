import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Drawing, useDescription } from "#described.ts";
import { createEngine, defaultEngine } from "#engine.ts";
import { layouts } from "#hooks.fixtures.ts";
import { FormProvider } from "#provider.tsx";
import { type Renderer } from "#renderer.ts";
import { type Schema } from "#schema.ts";
import { type Translate, untranslated } from "#translate.ts";

const own: Renderer = { draw: () => null, suits: () => 1 };
const provided: Renderer = { draw: () => null, suits: () => 2 };
const drawing: Drawing = { layouts, renderers: [own] };
const engine = createEngine();
const translate: Translate = (_keys, { defaultValue }) => defaultValue;
const schema: Schema = {
  properties: { name: { type: "string" } },
  type: "object",
  "x-form": { id: "contact", of: ["name"] },
};

/**
 * Puts an engine, a renderer and a translator in scope.
 */
function providing({ children }: { children?: ReactNode }): ReactNode {
  return (
    <FormProvider engine={engine} renderers={[provided]} translate={translate}>
      {children}
    </FormProvider>
  );
}

describe("useDescription", () => {
  it("reads the identifier from the schema's own keyword", () => {
    const { result } = renderHook(() => useDescription({ schema }, drawing));

    expect(result.current.id).toBe("contact");
    expect(result.current.presentation).toStrictEqual({
      fields: {},
      id: "contact",
      of: ["name"],
    });
  });

  it("takes the presentation's identifier over the schema's", () => {
    const { result } = renderHook(() =>
      useDescription({ presentation: { id: "given" }, schema }, drawing),
    );

    expect(result.current.id).toBe("given");
  });

  it("takes the identifier given over the presentation's", () => {
    const { result } = renderHook(() =>
      useDescription({ id: "stated", presentation: { id: "given" }, schema }, drawing),
    );

    expect(result.current.id).toBe("stated");
  });

  it("takes the identifier given where no presentation is", () => {
    const { result } = renderHook(() => useDescription({ id: "stated", schema }, drawing));

    expect(result.current.presentation).toStrictEqual({ fields: {}, id: "stated", of: ["name"] });
  });

  it("throws when a member names a path no branch of the schema has", () => {
    expect(() =>
      renderHook(() => useDescription({ presentation: { id: "p", of: ["nam"] }, schema }, drawing)),
    ).toThrow(/"nam"/u);
  });

  it("reads the defaults where nothing is in scope", () => {
    const { result } = renderHook(() => useDescription({ schema }, drawing));

    expect(result.current.engine).toBe(defaultEngine());
    expect(result.current.renderers).toStrictEqual([own]);
    expect(result.current.translate).toBe(untranslated);
    expect(result.current.fieldValidators).toStrictEqual({});
  });

  it("reads the provider's engine and translator and appends its renderers", () => {
    const { result } = renderHook(() => useDescription({ schema }, drawing), {
      wrapper: providing,
    });

    expect(result.current.engine).toBe(engine);
    expect(result.current.renderers).toStrictEqual([own, provided]);
    expect(result.current.translate).toBe(translate);
  });

  it("takes the engine and the translator given over the provider's", () => {
    const stated = createEngine();
    const { result } = renderHook(
      () => useDescription({ engine: stated, schema, translate: untranslated }, drawing),
      { wrapper: providing },
    );

    expect(result.current.engine).toBe(stated);
    expect(result.current.translate).toBe(untranslated);
  });

  it("converts a library object to a document", () => {
    const standard = {
      "~standard": { jsonSchema: { input: (): Schema => schema }, vendor: "x", version: 1 },
    };
    const { result } = renderHook(() => useDescription({ schema: standard }, drawing));

    expect(result.current.schema).toBe(schema);
  });
});
