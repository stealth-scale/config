import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm } from "@stealthscale/example-form-fields";
import { defaultsOf, type Presentation, type Schema } from "@stealthscale/provider-form";

import { Fields } from "#fields.tsx";
import { checkoutOptions, type Values } from "#options.ts";

/**
 * Owns a form over the schema given and draws the fields of the presentation given over it.
 */
function Owner({
  presentation,
  schema,
}: {
  readonly presentation: Presentation;
  readonly schema: Schema;
}): ReactElement {
  const form = useAppForm({ ...checkoutOptions, defaultValues: defaultsOf<Values>(schema) });

  return (
    <form.AppForm>
      <Fields form={form} presentation={presentation} resolved={schema} />
    </form.AppForm>
  );
}

describe("Fields", () => {
  it("draws nothing for a presentation that states no members", () => {
    const schema: Schema = { properties: { name: { type: "string" } }, type: "object" };
    const { container } = render(<Owner presentation={{ id: "p" }} schema={schema} />);

    expect(container.querySelector("input")).toBeNull();
  });

  it("skips a member the resolved schema lacks and one no renderer suits", () => {
    const schema: Schema = {
      properties: { gift: { type: "boolean" }, name: { type: "string" } },
      type: "object",
    };
    const { container, getByLabelText } = render(
      <Owner presentation={{ id: "p", of: ["name", "gift", "gone"] }} schema={schema} />,
    );

    expect(getByLabelText("Name").getAttribute("type")).toBe("text");
    expect(container.querySelectorAll("input")).toHaveLength(1);
  });

  it("reads a legend under another identifier a group names", () => {
    const schema: Schema = { properties: { name: { type: "string" } }, type: "object" };
    const { getByText } = render(
      <Owner
        presentation={{ id: "p", of: [{ legend: "shared.legend", of: ["name"] }] }}
        schema={schema}
      />,
    );

    expect(getByText("shared.legend").tagName).toBe("LEGEND");
  });

  it("draws a group with no legend as a layout alone", () => {
    const schema: Schema = { properties: { name: { type: "string" } }, type: "object" };
    const { container } = render(
      <Owner
        presentation={{ id: "p", of: [{ direction: "row", of: ["name"] }] }}
        schema={schema}
      />,
    );

    expect(container.querySelector("fieldset")).toBeNull();
    expect(container.querySelector(".row")).not.toBeNull();
  });

  it("draws a repeat group once per item and adds and removes one", () => {
    const schema: Schema = {
      properties: { tags: { items: { properties: { tag: { type: "string" } } }, type: "array" } },
      type: "object",
    };
    const page = render(
      <Owner
        presentation={{
          id: "p",
          of: [{ legend: true, name: "tag", of: ["tags[].tag"], repeat: "tags" }],
        }}
        schema={schema}
      />,
    );

    expect(page.queryAllByLabelText("Tag")).toHaveLength(0);

    fireEvent.click(page.getByRole("button", { name: "Add" }));
    fireEvent.click(page.getByRole("button", { name: "Add" }));

    expect(page.getAllByLabelText("Tag")).toHaveLength(2);

    fireEvent.click(page.getAllByRole("button", { name: "Remove" })[0] ?? page.container);

    expect(page.getAllByLabelText("Tag")).toHaveLength(1);
  });

  it("draws a repeat group with no legend as its items and the button alone", () => {
    const schema: Schema = {
      properties: { tags: { items: { properties: { tag: { type: "string" } } }, type: "array" } },
      type: "object",
    };
    const { container, getByRole } = render(
      <Owner
        presentation={{ id: "p", of: [{ of: [{ of: ["tags[].tag"] }], repeat: "tags" }] }}
        schema={schema}
      />,
    );

    expect(container.querySelector("fieldset")).toBeNull();
    expect(getByRole("button", { name: "Add" })).toBeDefined();
  });
});
