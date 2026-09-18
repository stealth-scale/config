import { FormApi } from "@tanstack/react-form";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { defaultEngine } from "#engine.ts";
import { layouts } from "#hooks.fixtures.ts";
import {
  type Described,
  describeForm,
  descriptionOf,
  type FormDescription,
  useDescribed,
  useDescribedForm,
  useDescribeForm,
} from "#registry.ts";
import { untranslated } from "#translate.ts";

const description: FormDescription = {
  draft: { clear: vi.fn<() => void>(), restored: undefined, write: vi.fn<() => void>() },
  engine: defaultEngine(),
  fieldOptions: {},
  id: "checkout",
  layouts,
  presentation: { id: "checkout" },
  renderers: [],
  schema: { type: "object" },
  translate: untranslated,
};

/**
 * Builds a form with nothing in it, so each case describes a form of its own.
 */
function form(): Described {
  return new FormApi({ defaultValues: { name: "" } });
}

describe("describeForm", () => {
  it("keeps the description under the form's store", () => {
    const one = form();

    describeForm(one, description);

    expect(descriptionOf(one)).toBe(description);
    expect(descriptionOf({ baseStore: one.baseStore })).toBe(description);
  });

  it("keeps one form's description apart from another's", () => {
    const one = form();

    describeForm(one, description);

    expect(descriptionOf(form())).toBeUndefined();
  });

  it("replaces a description that differs in a member", () => {
    const one = form();
    const renamed = { ...description, id: "signup" };

    describeForm(one, description);
    describeForm(one, renamed);

    expect(descriptionOf(one)).toBe(renamed);
  });

  it("keeps the description it has for one that describes the form the same way", () => {
    const one = form();

    describeForm(one, description);
    describeForm(one, { ...description, renderers: [...description.renderers] });

    expect(descriptionOf(one)).toBe(description);
  });
});

describe("useDescribeForm", () => {
  it("describes the form while it first renders", () => {
    const one = form();

    renderHook(() => {
      useDescribeForm(one, description);

      return descriptionOf(one);
    });

    expect(descriptionOf(one)).toBe(description);
  });

  it("replaces the description a later render gives once that render commits", () => {
    const one = form();
    const renamed = { ...description, id: "signup" };
    const { rerender } = renderHook(
      (given: FormDescription) => {
        useDescribeForm(one, given);
      },
      {
        initialProps: description,
      },
    );

    rerender(renamed);

    expect(descriptionOf(one)).toBe(renamed);
  });
});

describe("useDescribed", () => {
  it("reads the description of a form built from a schema", () => {
    const one = form();

    describeForm(one, description);

    expect(renderHook(() => useDescribed(one)).result.current).toBe(description);
  });

  it("reads nothing for a form nothing describes", () => {
    expect(renderHook(() => useDescribed(form())).result.current).toBeUndefined();
  });

  it("draws the reader again when the description changes", () => {
    const one = form();
    const renamed = { ...description, id: "signup" };

    describeForm(one, description);

    const { result } = renderHook(() => useDescribed(one));

    act(() => {
      describeForm(one, renamed);
    });

    expect(result.current).toBe(renamed);
  });

  it("leaves the reader alone when the form is described the same way", () => {
    const one = form();
    const rendered = vi.fn<() => void>();

    describeForm(one, description);

    renderHook(() => {
      rendered();

      return useDescribed(one);
    });

    act(() => {
      describeForm(one, { ...description });
    });

    expect(rendered).toHaveBeenCalledTimes(1);
  });

  it("stops following the description once the reader unmounts", () => {
    const one = form();
    const rendered = vi.fn<() => void>();

    describeForm(one, description);

    const { unmount } = renderHook(() => {
      rendered();

      return useDescribed(one);
    });

    unmount();
    act(() => {
      describeForm(one, { ...description, id: "signup" });
    });

    expect(rendered).toHaveBeenCalledTimes(1);
  });
});

describe("useDescribedForm", () => {
  it("returns the description of a form built from a schema", () => {
    const one = form();

    describeForm(one, description);

    expect(renderHook(() => useDescribedForm(one)).result.current).toBe(description);
  });

  it("throws when the form was not built from a schema", () => {
    expect(() => renderHook(() => useDescribedForm(form()))).toThrow(/useSchemaForm/u);
  });
});
