import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Bento } from "#bento.tsx";

describe("Bento", () => {
  it("draws five tiles in one grid", () => {
    const { getByRole } = render(<Bento />);

    expect(getByRole("region", { name: "Bento" }).children).toHaveLength(5);
  });

  it("draws the same tiles when it renders again", () => {
    const { getByRole, rerender } = render(<Bento />);

    rerender(<Bento />);

    expect(getByRole("region", { name: "Bento" }).children).toHaveLength(5);
  });
});
