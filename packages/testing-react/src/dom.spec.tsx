import { render } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { aria, attr, holds, renderedAs } from "#dom.ts";

describe("attr", () => {
  it("reads the state a part reports about itself", () => {
    const { container } = render(<div data-part="content" data-state="open" />);

    expect(attr(container, "content", "state")).toBe("open");
  });

  it("reads an attribute written with a dash, as the document spells it back", () => {
    const { container } = render(<div data-crop-shape="circle" data-part="root" />);

    expect(attr(container, "root", "cropShape")).toBe("circle");
  });

  it("answers nothing where the part carries no such attribute", () => {
    const { container } = render(<div data-part="root" />);

    expect(attr(container, "root", "state")).toBeUndefined();
  });

  it("says which part is missing rather than failing on nothing", () => {
    const { container } = render(<div />);

    expect(() => attr(container, "root", "state")).toThrow('[data-part="root"]');
  });
});

describe("aria", () => {
  it("reads what a part owes a screen reader", () => {
    const { container } = render(<span aria-current="page" data-part="current-link" />);

    expect(aria(container, "current-link", "aria-current")).toBe("page");
  });

  it("answers nothing where the part carries no such attribute, as reading a data one does", () => {
    const { container } = render(<span data-part="link" />);

    expect(aria(container, "link", "aria-current")).toBeUndefined();
  });

  it("says which part is missing rather than failing on nothing", () => {
    const { container } = render(<div />);

    expect(() => aria(container, "root", "aria-current")).toThrow('[data-part="root"]');
  });
});

describe("holds", () => {
  it("reports a part drawn inside another, which is what an anatomy states", () => {
    const { container } = render(
      <div data-part="arrow">
        <div data-part="arrow-tip" />
      </div>,
    );

    expect(holds(container, "arrow", "arrow-tip")).toBe(true);
  });

  it("reports a part drawn deeper down as held, nesting being about the tree rather than the step", () => {
    const { container } = render(
      <div data-part="positioner">
        <div>
          <div data-part="content" />
        </div>
      </div>,
    );

    expect(holds(container, "positioner", "content")).toBe(true);
  });

  it("reports a part drawn beside another as not held", () => {
    const { container } = render(
      <div>
        <div data-part="arrow" />
        <div data-part="content" />
      </div>,
    );

    expect(holds(container, "arrow", "content")).toBe(false);
  });

  it("says which part is missing rather than answering false", () => {
    const { container } = render(<div data-part="arrow" />);

    expect(() => holds(container, "arrow", "arrow-tip")).toThrow('[data-part="arrow-tip"]');
  });
});

describe("renderedAs", () => {
  it("reports the element a part rendered as", () => {
    const { container } = render(<article data-part="root" />);

    expect(renderedAs(container, "root")).toBe("ARTICLE");
  });

  it("reports the one it was asked to be, which is what polymorphism owes a page outline", () => {
    const { container } = render(<h2 data-part="title">A heading</h2>);

    expect(renderedAs(container, "title")).toBe("H2");
  });

  it("reports a mark drawn in SVG under the same spelling as an HTML one", () => {
    // The document reports an HTML tag upper-cased and an SVG one as it was written, which would
    // otherwise make an icon the one part a specification names in lower case.
    const { container } = render(<svg data-part="icon" />);

    expect(renderedAs(container, "icon")).toBe("SVG");
  });
});
