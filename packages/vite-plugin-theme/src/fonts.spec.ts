import { describe, expect, it } from "vitest";

import { renderStylesheet } from "#fonts.ts";
import { resolveOptions } from "#options.ts";

describe("fonts", () => {
  it("renders the cascade order alone when no face was named", () => {
    expect(renderStylesheet(resolveOptions().layers, [])).toBe(
      "@layer reset, base, tokens, recipes, utilities;\n",
    );
  });

  it("renders the layers under the names the repository chose", () => {
    expect(
      renderStylesheet(resolveOptions({ layers: { reset: "acme-reset" } }).layers, []),
    ).toContain("@layer acme-reset,");
  });

  it("imports each face before the layers in the order given", () => {
    const written = renderStylesheet(resolveOptions().layers, ["/f/one.css", "@f/two"]);

    expect(written).toBe(
      '@import "/f/one.css";\n@import "@f/two";\n@layer reset, base, tokens, recipes, utilities;\n',
    );
  });
});
