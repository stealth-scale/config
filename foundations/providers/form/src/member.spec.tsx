import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useSchemaForm } from "#hooks.fixtures.ts";
import { Member } from "#member.tsx";
import { type Member as Placed } from "#presentation.ts";
import { type Schema } from "#schema.ts";
import { translateFrom } from "#translate.ts";

const checkout: Schema = {
  properties: {
    billing: { properties: { city: { type: "string" } }, type: "object" },
    lines: { items: { properties: { amount: { type: "number" } } }, type: "array" },
    name: { type: "string" },
  },
  type: "object",
};

const words = translateFrom({ "shared.legend": "Shared words" });

/**
 * Builds a form from the schema and draws one member of it.
 */
function Page({ member }: { readonly member: Placed }): ReactElement {
  const form = useSchemaForm({ schema: checkout, translate: words });

  return (
    <form.AppForm>
      <Member indices={[]} member={member} resolved={checkout} />
    </form.AppForm>
  );
}

describe("Member", () => {
  it("draws a path as its field", () => {
    const { getByLabelText } = render(<Page member="billing.city" />);

    expect(getByLabelText("City").getAttribute("name")).toBe("billing.city");
  });

  it("draws a group with a legend as a fieldset reading the group's name", () => {
    const { getByText } = render(<Page member={{ legend: true, name: "billing", of: ["name"] }} />);

    expect(getByText("Billing").tagName).toBe("LEGEND");
  });

  it("reads a legend under another identifier a group names", () => {
    const { getByText } = render(<Page member={{ legend: "shared.legend", of: ["name"] }} />);

    expect(getByText("Shared words").tagName).toBe("LEGEND");
  });

  it("draws a group with no legend as its layout alone", () => {
    const { container } = render(<Page member={{ direction: "row", of: ["name"] }} />);

    expect(container.querySelector("fieldset")).toBeNull();
    expect(container.querySelector(".row input")).not.toBeNull();
  });

  it("draws no fieldset for a group whose legend is false or that has no name", () => {
    const { container, rerender } = render(
      <Page member={{ legend: false, name: "billing", of: ["name"] }} />,
    );

    expect(container.querySelector("fieldset")).toBeNull();

    rerender(<Page member={{ legend: true, of: ["name"] }} />);

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("hands the layout the columns and whether the group starts closed", () => {
    const { container } = render(
      <Page member={{ closed: true, columns: 3, legend: true, name: "billing", of: ["name"] }} />,
    );

    expect(container.querySelector("details summary")?.textContent).toBe("Billing");
    expect(container.querySelector(".columns-3 input")).not.toBeNull();
  });

  it("draws a repeat group once per item", () => {
    const { getByRole, queryByLabelText } = render(
      <Page member={{ legend: true, name: "line", of: ["lines[].amount"], repeat: "lines" }} />,
    );

    expect(queryByLabelText("Amount")).toBeNull();
    expect(getByRole("button", { name: "Add" })).toBeDefined();
  });
});
