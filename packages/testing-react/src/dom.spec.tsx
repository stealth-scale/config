import { render } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { attr, renderedAs } from "#dom.ts";

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
