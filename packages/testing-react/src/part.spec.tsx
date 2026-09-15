import { render } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { only, part, parts } from "#part.ts";

/**
 * Renders nothing, which is what a component with nothing to show does.
 *
 * @returns No element at all.
 */
function Nothing(): null {
  return null;
}

describe("part", () => {
  it("finds the piece of the anatomy carrying the name", () => {
    const { container } = render(<article data-part="root" />);

    expect(part(container, "root").tagName).toBe("ARTICLE");
  });

  it("finds it below the top of the output, an anatomy being a tree", () => {
    const { container } = render(
      <div data-part="root">
        <span data-part="indicator" />
      </div>,
    );

    expect(part(container, "indicator").tagName).toBe("SPAN");
  });

  it("names the part it could not find, rather than answering nothing", () => {
    const { container } = render(<div data-part="root" />);

    expect(() => part(container, "trigger")).toThrow('[data-part="trigger"]');
  });

  it("answers the first where a component drew the part more than once", () => {
    const { container } = render(
      <div>
        <span data-part="item" id="one" />
        <span data-part="item" id="two" />
      </div>,
    );

    expect(part(container, "item").id).toBe("one");
  });
});

describe("parts", () => {
  it("answers every element under the name, in the order the document holds them", () => {
    const { container } = render(
      <div>
        <span data-part="item" id="one" />
        <span data-part="item" id="two" />
      </div>,
    );

    expect(parts(container, "item").map((one) => one.id)).toEqual(["one", "two"]);
  });

  it("answers a list rather than the collection, so a specification can map over it", () => {
    const { container } = render(<span data-part="item" />);

    expect(Array.isArray(parts(container, "item"))).toBe(true);
  });

  it("answers none where the component drew none, which is a thing to assert", () => {
    const { container } = render(<div data-part="root" />);

    expect(parts(container, "item")).toEqual([]);
  });
});

describe("only", () => {
  it("answers the one element the render produced", () => {
    const { container } = render(<article />);

    expect(only(container).tagName).toBe("ARTICLE");
  });

  it("says the render produced nothing rather than answering nothing", () => {
    const { container } = render(<Nothing />);

    expect(() => only(container)).toThrow("no element");
  });

  it("answers the mark a component drew, which is SVG rather than HTML", () => {
    const container = document.createElement("div");

    container.append(document.createElementNS("http://www.w3.org/2000/svg", "svg"));

    expect(only(container).tagName).toBe("svg");
  });

  it("says what it found where the render produced neither", () => {
    const container = document.createElement("div");

    container.append(document.createElementNS("http://www.w3.org/1998/Math/MathML", "math"));

    expect(() => only(container)).toThrow("<math>");
  });
});
