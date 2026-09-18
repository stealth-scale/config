import { renderToString } from "react-dom/server";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { Portal } from "#portal/portal.ts";

describe("Portal", () => {
  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Portal, { props: { children: <p>Elsewhere</p> } }),
    ).resolves.toStrictEqual([]);
  });

  it("draws its content at the document's body where a caller names no container", () => {
    const { container } = render(<Portal>Elsewhere</Portal>);

    expect(container.textContent).toBe("");
    expect(document.body.textContent).toContain("Elsewhere");
  });

  it("draws its content at the container a caller names", () => {
    const elsewhere = document.createElement("section");

    document.body.append(elsewhere);
    render(<Portal container={elsewhere}>Elsewhere</Portal>);

    expect(elsewhere.textContent).toBe("Elsewhere");
    elsewhere.remove();
  });

  it("draws its content where it was written where a caller turns it off", () => {
    const { container } = render(<Portal disabled>Here</Portal>);

    expect(container.textContent).toBe("Here");
  });

  it("takes its content away again when it goes", () => {
    const { unmount } = render(<Portal>Elsewhere</Portal>);

    unmount();

    expect(document.body.textContent).not.toContain("Elsewhere");
  });

  it("draws nothing where it holds nothing", () => {
    const { container } = render(<Portal />);

    expect(container.textContent).toBe("");
  });

  it("draws nothing while a page is rendered to a string", () => {
    expect(renderToString(<Portal>Elsewhere</Portal>)).toBe("");
  });

  it("draws its content while a page is rendered to a string where it is turned off", () => {
    expect(renderToString(<Portal disabled>Here</Portal>)).toBe("Here");
  });
});
