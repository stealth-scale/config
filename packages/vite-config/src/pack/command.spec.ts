import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { command } from "#pack/command.ts";

/**
 * Reads back the commands a layer states.
 *
 * @param stated - Each command name against the file behind it.
 * @returns The bin map the packer is handed.
 */
function installs(stated: Record<string, string>): Record<string, string> {
  const held = (command(stated).config as UserConfig).pack as {
    exports: { bin: Record<string, string> };
  };

  return held.exports.bin;
}

test("installs the command under the name it is run by, not the one the package is called", () => {
  expect(installs({ stealth: "src/bin/stealth.ts" })).toEqual({ stealth: "src/bin/stealth.ts" });
});

test("installs more than one, a package shipping two commands naming both", () => {
  expect(Object.keys(installs({ one: "src/one.ts", two: "src/two.ts" }))).toEqual(["one", "two"]);
});

test("copies what it was given, so a caller's object is not the packer's", () => {
  const stated = { stealth: "src/bin/stealth.ts" };

  expect(installs(stated)).not.toBe(stated);
});

test("names the commands, so a config says what a package installs", () => {
  expect(command({ stealth: "src/bin/stealth.ts" }).name).toBe("pack.command(stealth)");
});
