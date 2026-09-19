import { describe, expect, it } from "vitest";

import { type Panel, panelStore } from "#app-shell/panels.ts";

/**
 * Builds a panel that says whatever a case wants it to say.
 *
 * @param open - Whether the panel is shown.
 * @returns The panel, as a part would publish it.
 */
function panelOf(open: boolean): Panel {
  return { id: "navbar", open, overlaid: false, setOpen: () => {}, stacked: false };
}

describe("panelStore", () => {
  it("opens holding nothing", () => {
    expect(panelStore().read()).toStrictEqual({});
  });

  it("keeps a panel under the name it was published as", () => {
    const store = panelStore();

    store.publish("navbar", panelOf(true));

    expect(store.read()["navbar"]?.open).toBe(true);
  });

  it("takes a panel that has left off the list", () => {
    const store = panelStore();

    store.publish("navbar", panelOf(true));
    store.publish("navbar");

    expect(store.read()).toStrictEqual({});
  });

  it("tells a reader when a panel changes", () => {
    const store = panelStore();
    let told = 0;

    store.subscribe(() => {
      told += 1;
    });
    store.publish("navbar", panelOf(true));

    expect(told).toBe(1);
  });

  it("tells nobody where a panel publishes what it was already doing", () => {
    const store = panelStore();
    const same = panelOf(true);
    let told = 0;

    store.publish("navbar", same);
    store.subscribe(() => {
      told += 1;
    });
    store.publish("navbar", { ...same });

    expect(told).toBe(0);
  });

  it("answers the same list until something changes", () => {
    const store = panelStore();
    const same = panelOf(true);

    store.publish("navbar", same);

    const first = store.read();

    store.publish("navbar", { ...same });

    expect(store.read()).toBe(first);
  });

  it("stops telling a reader that has stopped listening", () => {
    const store = panelStore();
    let told = 0;

    store.subscribe(() => {
      told += 1;
    })();
    store.publish("navbar", panelOf(true));

    expect(told).toBe(0);
  });

  it("holds each panel apart from the next", () => {
    const store = panelStore();

    store.publish("navbar", panelOf(true));
    store.publish("aside", panelOf(false));

    expect(Object.keys(store.read()).toSorted()).toStrictEqual(["aside", "navbar"]);
  });
});
