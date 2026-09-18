import { type ReactElement, type ReactNode } from "react";

import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "#accessibility.ts";

function Named(): ReactElement {
  return <button type="button">Save</button>;
}

function Unnamed(): ReactElement {
  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label -- the case is a control without a label, which the audit has to report
    <button type="button" />
  );
}

function Item(): ReactElement {
  return <li>One</li>;
}

function listed(children: ReactNode): ReactElement {
  return <ul>{children}</ul>;
}

describe("accessibilityViolations", () => {
  it("returns no violation for a button with a name", async () => {
    await expect(accessibilityViolations(Named)).resolves.toStrictEqual([]);
  });

  it("names the rule a button without a name breaks", async () => {
    const found = await accessibilityViolations(Unnamed);

    expect(found.map((each) => each.split(":")[0])).toContain("button-name");
  });

  it("audits a part inside the root it needs", async () => {
    await expect(accessibilityViolations(Item, { wrapper: listed })).resolves.toStrictEqual([]);
  });
});
