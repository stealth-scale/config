import { describe, expect, it } from "vitest";

import { ENTRY, type Exposed, type Remotes, type Shared, UNSET } from "#federation/settings.ts";

describe("settings", () => {
  it("names the entry without a hash", () => {
    expect(ENTRY).toBe("remoteEntry.js");
    expect(ENTRY).not.toMatch(/-[A-Za-z0-9_]{8}\./u);
  });

  it("maps each imported name to the module behind it", () => {
    const held: Exposed = { "./Dashboard": "./src/dashboard.tsx" };

    expect(held["./Dashboard"]).toBe("./src/dashboard.tsx");
  });

  it("names each remote without stating where it is", () => {
    const held: Remotes = ["remote"];

    expect(held).toStrictEqual(["remote"]);
  });

  it("stands an unregistered remote at a name that never resolves", () => {
    expect(UNSET).toContain(".invalid");
  });

  it("declares whether a shared dependency is a singleton and which versions qualify", () => {
    const held: Shared = { react: { requiredVersion: "^19.0.0", singleton: true } };

    expect(held["react"]?.singleton).toBe(true);
  });
});
