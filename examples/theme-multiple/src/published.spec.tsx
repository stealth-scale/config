import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Published } from "#published.tsx";

describe("Published", () => {
  it("draws the typography section above the actions section", () => {
    const { getAllByRole } = render(<Published />);

    expect(getAllByRole("heading", { level: 2 }).map((each) => each.textContent)).toStrictEqual([
      "Typography",
      "Actions",
    ]);
  });
});
