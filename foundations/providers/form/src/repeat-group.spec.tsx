import { type ReactElement } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FieldMember } from "#field-member.tsx";
import { useSchemaForm } from "#hooks.fixtures.ts";
import { type Group } from "#presentation.ts";
import { RepeatGroup } from "#repeat-group.tsx";
import { type Schema } from "#schema.ts";

const order: Schema = {
  properties: {
    lines: {
      items: {
        properties: {
          amount: { default: 1, type: "number" },
          tags: { items: { properties: { tag: { type: "string" } } }, type: "array" },
        },
      },
      type: "array",
    },
    tags: { type: "array" },
  },
  type: "object",
};

const bounded: Schema = {
  properties: { tags: { maxItems: 2, minItems: 1, type: "array" } },
  type: "object",
};

const lines: Group = { legend: true, name: "line", of: ["lines[].amount"], repeat: "lines" };
const tags: Group = { of: [], repeat: "tags" };

/**
 * Builds a form from the schema, starting from the lines given, and draws the group over it.
 */
function Page({
  group = lines,
  schema = order,
  values,
}: {
  readonly group?: Group | undefined;
  readonly schema?: Schema | undefined;
  readonly values?: Record<string, unknown> | undefined;
}): ReactElement {
  const form = useSchemaForm({ schema, values });

  return (
    <form.AppForm>
      <RepeatGroup
        draw={(indices) =>
          group.of.map((member) =>
            typeof member === "string" ? (
              <FieldMember indices={indices} key={member} path={member} resolved={schema} />
            ) : (
              <RepeatGroup
                draw={(inner) =>
                  member.of.map((path) =>
                    typeof path === "string" ? (
                      <FieldMember indices={inner} key={path} path={path} resolved={schema} />
                    ) : null,
                  )
                }
                group={member}
                indices={indices}
                key={member.name}
                legend={undefined}
                repeat={member.repeat ?? ""}
              />
            ),
          )
        }
        group={group}
        indices={[]}
        legend={group.legend === true ? "Lines" : undefined}
        repeat={group.repeat ?? ""}
      />
    </form.AppForm>
  );
}

describe("RepeatGroup", () => {
  it("draws the group once per item the values hold", () => {
    const { getAllByLabelText, getByText } = render(
      <Page values={{ lines: [{ amount: 2 }, { amount: 3 }] }} />,
    );

    expect(getByText("Lines").tagName).toBe("LEGEND");
    expect(
      getAllByLabelText("Amount").map((control) => control.getAttribute("name")),
    ).toStrictEqual(["lines[0].amount", "lines[1].amount"]);
  });

  it("adds an item from the item schema's defaults and focuses its first field", () => {
    const { getByLabelText, getByRole } = render(<Page />);

    fireEvent.click(getByRole("button", { name: "Add" }));

    expect(getByLabelText("Amount")).toHaveProperty("value", "1");
    expect(document.activeElement).toHaveProperty("name", "lines[0].amount");
  });

  it("adds an empty item without moving focus where the group has no field", () => {
    const { container, getByRole } = render(<Page group={tags} />);
    const button = getByRole("button", { name: "Add" });

    button.focus();
    fireEvent.click(button);

    expect(document.activeElement).toBe(button);
    expect(container.querySelectorAll(".item")).toHaveLength(1);
  });

  it("removes the item whose control is pressed and focuses the item taking its place", async () => {
    const page = render(<Page values={{ lines: [{ amount: 2 }, { amount: 3 }] }} />);

    fireEvent.click(page.getAllByRole("button", { name: "Remove" })[0] ?? page.container);

    await expect(page.findAllByLabelText("Amount")).resolves.toHaveLength(1);
    expect(page.getByLabelText("Amount")).toHaveProperty("value", "3");
    expect(document.activeElement).toBe(page.getByLabelText("Amount"));
  });

  it("focuses the last item once the last one is removed", async () => {
    const page = render(<Page values={{ lines: [{ amount: 2 }, { amount: 3 }] }} />);

    fireEvent.click(page.getAllByRole("button", { name: "Remove" })[1] ?? page.container);

    await expect(page.findAllByLabelText("Amount")).resolves.toHaveLength(1);
    expect(document.activeElement).toBe(page.getByLabelText("Amount"));
  });

  it("focuses the group's add control once the only item is removed", async () => {
    const page = render(<Page values={{ lines: [{ amount: 2 }] }} />);

    fireEvent.click(page.getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(page.queryByLabelText("Amount")).toBeNull();
    });
    expect(document.activeElement).toBe(page.getByRole("button", { name: "Add" }));
  });

  it("writes the ids the foundation gives the group and its items", () => {
    const { container } = render(<Page values={{ lines: [{ amount: 2 }, { amount: 3 }] }} />);
    const group = container.querySelector("fieldset");
    const items = [...container.querySelectorAll<HTMLElement>(".item")].map((item) => item.id);

    expect(group?.id).not.toBe("");
    expect(items).toStrictEqual([`${group?.id ?? ""}-0`, `${group?.id ?? ""}-1`]);
  });

  it("withholds the add control once the array holds its maxItems", () => {
    const { getAllByRole, queryByRole } = render(
      <Page group={tags} schema={bounded} values={{ tags: [1, 2] }} />,
    );

    expect(queryByRole("button", { name: "Add" })).toBeNull();
    expect(getAllByRole("button", { name: "Remove" })).toHaveLength(2);
  });

  it("withholds the remove controls while the array holds no more than its minItems", () => {
    const { getByRole, queryByRole } = render(
      <Page group={tags} schema={bounded} values={{ tags: [1] }} />,
    );

    expect(queryByRole("button", { name: "Remove" })).toBeNull();
    expect(getByRole("button", { name: "Add" })).toBeDefined();
  });

  it("offers both controls where the array states no bounds", () => {
    const { getAllByRole, getByRole } = render(<Page group={tags} values={{ tags: [1] }} />);

    expect(getByRole("button", { name: "Add" })).toBeDefined();
    expect(getAllByRole("button", { name: "Remove" })).toHaveLength(1);
  });

  it("binds a group inside a repeat group to both indices", () => {
    const nested: Group = {
      of: ["lines[].amount", { name: "tags", of: ["lines[].tags[].tag"], repeat: "lines[].tags" }],
      repeat: "lines",
    };
    const { getByLabelText } = render(
      <Page
        group={nested}
        values={{ lines: [{ amount: 1, tags: [{ tag: "" }, { tag: "b" }] }] }}
      />,
    );

    expect(getByLabelText("Amount").getAttribute("name")).toBe("lines[0].amount");
    expect(getByLabelText("Tag", { selector: "[value='b']" }).getAttribute("name")).toBe(
      "lines[0].tags[1].tag",
    );
  });
});
