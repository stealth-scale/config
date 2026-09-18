import { describe, expect, it } from "vitest";

import { byControl, RANK, type Renderer, rendererFor } from "#renderer.ts";

/**
 * Builds a renderer that answers one rank for every field, or nothing where none is given.
 */
function ranked(rank?: number): Renderer {
  return { draw: () => null, suits: () => rank };
}

const text: Renderer = {
  draw: () => null,
  suits: (_, schema) => (schema["type"] === "string" ? RANK.type : undefined),
};
const email: Renderer = {
  draw: () => null,
  suits: (_, schema) => (schema["format"] === "email" ? RANK.format : undefined),
};
const textarea: Renderer = { draw: () => null, suits: byControl("textarea") };

describe("rendererFor", () => {
  it("picks the renderer answering the highest rank", () => {
    expect(rendererFor([text, email], {}, { format: "email", type: "string" })).toBe(email);
  });

  it("picks the later registration on a tie", () => {
    const first = ranked(RANK.type);
    const second = ranked(RANK.type);

    expect(rendererFor([first, second], {}, { type: "string" })).toBe(second);
  });

  it("returns nothing when no renderer suits the field", () => {
    expect(rendererFor([text, email], {}, { type: "number" })).toBeUndefined();
  });

  it("prefers a renderer the field names by control over any fit by schema", () => {
    expect(rendererFor([text, textarea], { control: "textarea" }, { type: "string" })).toBe(
      textarea,
    );
  });

  it("ignores a renderer answering nothing", () => {
    expect(rendererFor([ranked(), text], {}, { type: "string" })).toBe(text);
  });
});

describe("byControl", () => {
  it("answers the control rank for a field naming the renderer", () => {
    expect(byControl("textarea")({ control: "textarea" }, {})).toBe(RANK.control);
  });

  it("answers nothing for a field naming another renderer", () => {
    expect(byControl("textarea")({ control: "select" }, {})).toBeUndefined();
  });
});
