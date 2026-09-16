import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { aria, attr, holds, renderedAs } from "#dom.ts";

describe("attr", () => {
  it("returns the state a part reports about itself", () => {
    const { container } = render(<div data-part="content" data-state="open" />);

    expect(attr(container, "content", "state")).toBe("open");
  });

  it("returns an attribute written with a dash", () => {
    const { container } = render(<div data-crop-shape="circle" data-part="root" />);

    expect(attr(container, "root", "cropShape")).toBe("circle");
  });

  it("returns undefined when the part has no such attribute", () => {
    const { container } = render(<div data-part="root" />);

    expect(attr(container, "root", "state")).toBeUndefined();
  });

  it("throws naming the part that is missing", () => {
    const { container } = render(<div />);

    expect(() => attr(container, "root", "state")).toThrow('[data-part="root"]');
  });
});

describe("aria", () => {
  it("returns what a part exposes to a screen reader", () => {
    const { container } = render(<span aria-current="page" data-part="current-link" />);

    expect(aria(container, "current-link", "aria-current")).toBe("page");
  });

  it("returns undefined when the part has no such aria attribute", () => {
    const { container } = render(<span data-part="link" />);

    expect(aria(container, "link", "aria-current")).toBeUndefined();
  });

  it("throws naming the part that is missing", () => {
    const { container } = render(<div />);

    expect(() => aria(container, "root", "aria-current")).toThrow('[data-part="root"]');
  });
});

describe("holds", () => {
  it("returns true for a part drawn inside another", () => {
    const { container } = render(
      <div data-part="arrow">
        <div data-part="arrow-tip" />
      </div>,
    );

    expect(holds(container, "arrow", "arrow-tip")).toBe(true);
  });

  it("returns true for a part drawn deeper in the tree", () => {
    const { container } = render(
      <div data-part="positioner">
        <div>
          <div data-part="content" />
        </div>
      </div>,
    );

    expect(holds(container, "positioner", "content")).toBe(true);
  });

  it("returns false for a part drawn beside another", () => {
    const { container } = render(
      <div>
        <div data-part="arrow" />
        <div data-part="content" />
      </div>,
    );

    expect(holds(container, "arrow", "content")).toBe(false);
  });

  it("throws naming the missing part rather than returning false", () => {
    const { container } = render(<div data-part="arrow" />);

    expect(() => holds(container, "arrow", "arrow-tip")).toThrow('[data-part="arrow-tip"]');
  });
});

describe("renderedAs", () => {
  it("returns the element a part rendered as", () => {
    const { container } = render(<article data-part="root" />);

    expect(renderedAs(container, "root")).toBe("ARTICLE");
  });

  it("returns the element asChild asked for", () => {
    const { container } = render(<h2 data-part="title">A heading</h2>);

    expect(renderedAs(container, "title")).toBe("H2");
  });

  it("returns an SVG mark under the same name as an HTML one", () => {
    const { container } = render(<svg data-part="icon" />);

    expect(renderedAs(container, "icon")).toBe("SVG");
  });
});
