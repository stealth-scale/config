import { describe, expect, it } from "vitest";

import { SPEC } from "#lint/rules/spec.ts";

const [, TITLE] = SPEC["vitest-js/valid-title"] as [
  string,
  {
    disallowedWords: readonly string[];
    mustMatch: { describe: [string, string]; it: [string, string] };
    mustNotMatch: { it: [string, string] };
  },
];

const matches = ([pattern]: [string, string], title: string): boolean =>
  new RegExp(pattern, "u").test(title);

describe("SPEC", () => {
  it("names every rule under the vitest plugin", () => {
    expect(Object.keys(SPEC).every((rule) => rule.startsWith("vitest-js/"))).toBe(true);
  });

  it("accepts a describe title that is one identifier", () => {
    expect(matches(TITLE.mustMatch.describe, "readWorkspaces")).toBe(true);
  });

  it("refuses a describe title written as a sentence", () => {
    expect(matches(TITLE.mustMatch.describe, "the css config with stylesheets")).toBe(false);
  });

  it("accepts a case title opening on a lower-case verb", () => {
    expect(matches(TITLE.mustMatch.it, "returns an empty array")).toBe(true);
  });

  it("refuses a case title opening on a capital", () => {
    expect(matches(TITLE.mustMatch.it, "Returns an empty array")).toBe(false);
  });

  it("refuses a case title carrying a comma", () => {
    expect(matches(TITLE.mustMatch.it, "sets kind, so the pipeline tells them apart")).toBe(false);
  });

  it("refuses a case title opening on should", () => {
    expect(matches(TITLE.mustNotMatch.it, "should return an empty array")).toBe(true);
  });

  it("accepts should anywhere but the opening", () => {
    expect(matches(TITLE.mustNotMatch.it, "returns what the caller should see")).toBe(false);
  });

  it("states a reason beside every pattern", () => {
    const configured = [TITLE.mustMatch.describe, TITLE.mustMatch.it, TITLE.mustNotMatch.it];

    expect(configured.every(([, message]) => message.length > 0)).toBe(true);
  });

  it("refuses the words that claim an assertion", () => {
    expect(TITLE.disallowedWords).toStrictEqual(["correctly", "properly", "works"]);
  });

  it("requires every case to sit under a describe", () => {
    expect(SPEC["vitest-js/require-top-level-describe"]).toBe("error");
  });

  it("refuses a describe nested inside another", () => {
    expect(SPEC["vitest-js/max-nested-describe"]).toStrictEqual(["error", { max: 1 }]);
  });

  it("writes every case as it rather than test", () => {
    expect(SPEC["vitest-js/consistent-test-it"]).toStrictEqual([
      "error",
      { fn: "it", withinDescribe: "it" },
    ]);
  });

  it("requires an assertion in every case", () => {
    expect(SPEC["vitest-js/expect-expect"]).toBe("error");
  });

  it("refuses a case whose body branches", () => {
    expect(SPEC["vitest-js/no-conditional-in-test"]).toBe("error");
  });

  it("refuses an assertion reached by a branch", () => {
    expect(SPEC["vitest-js/no-conditional-expect"]).toBe("error");
  });

  it("turns the function-title rule off", () => {
    expect(SPEC["vitest-js/prefer-describe-function-title"]).toBe("off");
  });
});
