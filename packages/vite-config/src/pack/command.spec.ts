import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { command } from "#pack/command.ts";

function installs(stated: Record<string, string>): Record<string, string> {
  const held = (command(stated).config as UserConfig).pack as {
    exports: { bin: Record<string, string> };
  };

  return held.exports.bin;
}

describe("command", () => {
  it("installs the command under the name it is run by", () => {
    expect(installs({ stealth: "src/bin/stealth.ts" })).toStrictEqual({
      stealth: "src/bin/stealth.ts",
    });
  });

  it("installs more than one", () => {
    expect(Object.keys(installs({ one: "src/one.ts", two: "src/two.ts" }))).toStrictEqual([
      "one",
      "two",
    ]);
  });

  it("copies the commands it was given", () => {
    const stated = { stealth: "src/bin/stealth.ts" };

    expect(installs(stated)).not.toBe(stated);
  });

  it("names the commands", () => {
    expect(command({ stealth: "src/bin/stealth.ts" }).name).toBe("pack.command(stealth)");
  });
});
