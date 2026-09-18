import { type ReactElement, useState } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Item } from "#roving-focus/item.tsx";
import { Root, type RootProps } from "#roving-focus/root.tsx";

/**
 * Draws a group of three items, the middle one disabled where the case asks.
 */
function group(props: { middle?: boolean } & Partial<RootProps> = {}): RootProps["children"] {
  const { middle = false, ...rest } = props;

  return (
    <Root role="toolbar" {...rest}>
      <Item id="one">One</Item>
      <Item disabled={middle} id="two">
        Two
      </Item>
      <Item id="three">Three</Item>
    </Root>
  );
}

/**
 * Draws a group whose first item arrives after the others have registered.
 */
function Late(): ReactElement {
  const [first, setFirst] = useState(false);

  return (
    <Root role="toolbar">
      {first ? <Item id="one">One</Item> : undefined}
      <Item id="two">Two</Item>
      <Item id="three">Three</Item>
      <button
        onClick={() => {
          setFirst(true);
        }}
        type="button"
      >
        Add
      </button>
    </Root>
  );
}

describe("useRovingFocus", () => {
  it("puts the first item in the tab order and no other", () => {
    const { getByText } = render(group());

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
    expect(getByText("Two").getAttribute("tabindex")).toBe("-1");
    expect(getByText("Three").getAttribute("tabindex")).toBe("-1");
  });

  it("moves the tab stop to the next item on the arrow that runs along the line", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(getByText("Two").getAttribute("tabindex")).toBe("0");
    expect(getByText("One").getAttribute("tabindex")).toBe("-1");
  });

  it("moves the tab stop back on the arrow that runs the other way", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });
    fireEvent.keyDown(getByText("Two"), { key: "ArrowLeft" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("claims no arrow that runs across the direction the group moves on", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "ArrowDown" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("moves on the arrows that run down the page where the group runs that way", () => {
    const { getByText } = render(group({ orientation: "vertical" }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowDown" });

    expect(getByText("Two").getAttribute("tabindex")).toBe("0");
  });

  it("moves on either pair of arrows where the group moves on both", () => {
    const { getByText } = render(group({ orientation: "both" }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowDown" });

    expect(getByText("Two").getAttribute("tabindex")).toBe("0");
  });

  it("stops at the last item where the ends do not join up", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "End" });
    fireEvent.keyDown(getByText("Three"), { key: "ArrowRight" });

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
  });

  it("comes round to the first item where the ends join up", () => {
    const { getByText } = render(group({ wrap: true }));

    fireEvent.keyDown(getByText("One"), { key: "End" });
    fireEvent.keyDown(getByText("Three"), { key: "ArrowRight" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("moves the tab stop to each end on Home and End", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "End" });

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");

    fireEvent.keyDown(getByText("Three"), { key: "Home" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("passes the arrows over a disabled item", () => {
    const { getByText } = render(group({ middle: true }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
    expect(getByText("Two").getAttribute("tabindex")).toBe("-1");
  });

  it("claims no key that moves nothing", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "Enter" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("claims no arrow along the line where the group runs down the page", () => {
    const { getByText } = render(group({ orientation: "vertical" }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("runs the arrows the other way where the line runs right to left", () => {
    const { getByText } = render(group({ style: { direction: "rtl" } }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowLeft" });

    expect(getByText("Two").getAttribute("tabindex")).toBe("0");
  });

  it("claims no key a modifier is held with", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { ctrlKey: true, key: "ArrowRight" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("claims no key pressed outside its items", () => {
    const { getByRole, getByText } = render(group());

    fireEvent.keyDown(getByRole("toolbar"), { key: "ArrowRight" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("moves the tab stop to an item a pointer focuses", () => {
    const { getByText } = render(group());

    fireEvent.focus(getByText("Three"));

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
  });

  it("leaves the tab stop where it is when a pointer focuses a disabled item", () => {
    const { getByText } = render(group({ middle: true }));

    fireEvent.focus(getByText("Two"));

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("tells a caller the tab stop moved", () => {
    const moved: Array<string | undefined> = [];
    const { getByText } = render(
      group({
        onActiveIdChange: (activeId) => {
          moved.push(activeId);
        },
      }),
    );

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(moved).toContain("two");
  });

  it("follows the order the reader sees rather than the order the items registered", () => {
    const { getByText } = render(<Late />);

    fireEvent.click(getByText("Add"));
    fireEvent.keyDown(getByText("Two"), { key: "Home" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("steps from the first item where the stop is on an item no longer there", () => {
    const { getByText } = render(group({ activeId: "gone" }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(document.activeElement).toBe(getByText("Two"));
  });

  it("holds the tab stop where a caller drives it", () => {
    const { getByText } = render(group({ activeId: "three" }));

    fireEvent.keyDown(getByText("Three"), { key: "Home" });

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
  });
});
