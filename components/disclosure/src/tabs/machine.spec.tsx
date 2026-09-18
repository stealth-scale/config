import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  splitTabsProps,
  type TabsOptions,
  useTabs,
  useTabsMachine,
} from "#tabs/machine.ts";

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
 */
function Running(props: TabsOptions): ReactElement {
  const api = useTabsMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns Which panel is in force, and which way the set runs.
 */
function Reader(): ReactElement {
  const api = useTabs();
  const list: Record<string, unknown> = api.getListProps();

  return (
    <span data-testid="state">{`${api.value ?? "none"} ${String(list["aria-orientation"])}`}</span>
  );
}

describe("splitTabsProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitTabsProps({ defaultValue: "first", orientation: "vertical" });

    expect(options).toStrictEqual({ defaultValue: "first", orientation: "vertical" });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitTabsProps({ defaultValue: "first", size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useTabsMachine", () => {
  it("answers a running machine a part can read", async () => {
    await drawn(<Running defaultValue="first" />);

    expect(screen.getByTestId("state").textContent).toBe("first horizontal");
  });

  it("runs across where a caller says nothing", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("none horizontal");
  });

  it("takes the way the set runs from a caller that names one", async () => {
    await drawn(<Running defaultValue="first" orientation="vertical" />);

    expect(screen.getByTestId("state").textContent).toBe("first vertical");
  });

  it("keeps the machine's own default where a caller hands over nothing for it", async () => {
    await drawn(<Running defaultValue="first" orientation={undefined} />);

    expect(screen.getByTestId("state").textContent).toBe("first horizontal");
  });

  it("passes every setting the machine defaults through where a caller names them", async () => {
    await drawn(
      <Running activationMode="manual" defaultValue="first" loopFocus orientation="vertical" />,
    );

    expect(screen.getByTestId("state").textContent).toBe("first vertical");
  });
});
