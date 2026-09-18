import { describe, expect, it } from "vitest";

import { dashboard, routes } from "#routes.ts";

function importer(): () => Promise<unknown> {
  const declared = routes()[0]?.component;

  if (declared === undefined || !("load" in declared)) {
    throw new Error("The page is stated as a component rather than behind an importer.");
  }

  return declared.load;
}

describe("routes", () => {
  it("contributes one page", () => {
    expect(routes()).toHaveLength(1);
  });

  it("names the page by the id a link names it by", () => {
    expect(routes()[0]?.id).toBe(dashboard.id);
  });

  it("states the path relative to wherever the host mounts it", () => {
    expect(routes()[0]?.path).toBe("/reports");
  });

  it("labels the page for the navigation a host draws", () => {
    expect(routes()[0]).toMatchObject({ navigation: { label: "Reports" } });
  });

  it("names the export a host reads the page off", () => {
    expect(routes()[0]?.component).toHaveProperty("export", "Reports");
  });

  it("states the page behind an importer so a host loads its chunk on first use", async () => {
    await expect(importer()()).resolves.toHaveProperty("Reports");
  });
});
