import { type ESTree, parseSync } from "vite";
import { describe, expect, it } from "vitest";

import {
  bare,
  childrenOf,
  closing,
  declarationOf,
  importing,
  isNode,
  objectOf,
  referred,
  type Scoped,
  scoped,
} from "#scope.ts";

function parse(text: string): Scoped {
  return scoped(parseSync("/a.specimen.tsx", text).program, text);
}

function firstStatement(scope: Scoped): ESTree.Directive | ESTree.Statement {
  const [held] = scope.program.body;

  if (held === undefined) throw new Error("expected a statement");

  return held;
}

describe("scope", () => {
  it("records each name a top-level variable binds", () => {
    const scope = parse("const one = 1;\nconst other = 2;\n");

    expect([...scope.declared.keys()]).toStrictEqual(["one", "other"]);
  });

  it("records a name a function declaration binds", () => {
    expect([...parse("function draw() {}\n").declared.keys()]).toStrictEqual(["draw"]);
  });

  it("records a name an interface binds", () => {
    expect([...parse("interface Held { at: string }\n").declared.keys()]).toStrictEqual(["Held"]);
  });

  it("looks through an export to the declaration under it", () => {
    expect([...parse("export const one = 1;\n").declared.keys()]).toStrictEqual(["one"]);
  });

  it("records no name for a statement that declares nothing", () => {
    expect([...parse("draw();\n").declared.keys()]).toStrictEqual([]);
  });

  it("records no name for a destructured binding", () => {
    expect([...parse("const { one } = held;\n").declared.keys()]).toStrictEqual([]);
  });

  it("records every import in the order the file states them", () => {
    const scope = parse('import a from "one";\nimport { b } from "other";\n');

    expect(scope.imports).toHaveLength(2);
  });

  it("keys an import's specifiers by the local name they bind", () => {
    const scope = parse('import { b as c } from "other";\n');

    expect([...(scope.imports[0]?.specifiers.keys() ?? [])]).toStrictEqual(["c"]);
  });

  it("collects the names a subtree refers to", () => {
    const scope = parse("const one = draw(held);\n");

    expect([...referred(firstStatement(scope))]).toStrictEqual(["one", "draw", "held"]);
  });

  it("leaves a property's own key out of the names a subtree refers to", () => {
    const scope = parse("const one = { title: held };\n");

    expect([...referred(firstStatement(scope))]).toStrictEqual(["one", "held"]);
  });

  it("keeps a computed property's key among the names a subtree refers to", () => {
    const scope = parse("const one = { [title]: held };\n");

    expect([...referred(firstStatement(scope))]).toStrictEqual(["one", "title", "held"]);
  });

  it("leaves a member expression's property out of the names a subtree refers to", () => {
    const scope = parse("const one = held.title;\n");

    expect([...referred(firstStatement(scope))]).toStrictEqual(["one", "held"]);
  });

  it("leaves a jsx attribute's name out of the names a subtree refers to", () => {
    const scope = parse("const one = <Held title={shown} />;\n");

    expect([...referred(firstStatement(scope))]).toStrictEqual(["one", "Held", "shown"]);
  });

  it("returns the statements a set of names reaches", () => {
    const scope = parse("const one = 1;\nconst other = 2;\n");
    const reached = closing(scope, new Set(["one"]));

    expect(reached.size).toBe(1);
  });

  it("follows a name a reached declaration refers to in turn", () => {
    const scope = parse("const deep = 1;\nconst one = deep;\nconst spare = 2;\n");
    const reached = closing(scope, new Set(["one"]));

    expect(reached.size).toBe(2);
  });

  it("follows a pair of declarations referring to each other once", () => {
    const scope = parse("const one = () => other;\nconst other = () => one;\n");
    const reached = closing(scope, new Set(["one"]));

    expect(reached.size).toBe(2);
  });

  it("returns no statement for a name the file does not declare", () => {
    expect(closing(parse("const one = 1;\n"), new Set(["absent"])).size).toBe(0);
  });

  it("writes an import carrying only the specifiers a fragment uses", () => {
    const scope = parse('import { a, b } from "other";\n');
    const held = scope.imports[0];

    expect(held === undefined ? "" : importing(scope, held, new Set(["a"]))).toBe(
      'import { a } from "other";',
    );
  });

  it("writes a default specifier before the named ones", () => {
    const scope = parse('import held, { a } from "other";\n');
    const one = scope.imports[0];

    expect(one === undefined ? "" : importing(scope, one, new Set(["a", "held"]))).toBe(
      'import held, { a } from "other";',
    );
  });

  it("writes a default specifier with no named clause beside it", () => {
    const scope = parse('import held from "other";\n');
    const one = scope.imports[0];

    expect(one === undefined ? "" : importing(scope, one, new Set(["held"]))).toBe(
      'import held from "other";',
    );
  });

  it("keeps the type keyword on a type-only import", () => {
    const scope = parse('import type { A } from "other";\n');
    const held = scope.imports[0];

    expect(held === undefined ? "" : importing(scope, held, new Set(["A"]))).toBe(
      'import type { A } from "other";',
    );
  });

  it("writes nothing for an import a fragment uses none of", () => {
    const scope = parse('import { a } from "other";\n');
    const held = scope.imports[0];

    expect(held === undefined ? "missing" : importing(scope, held, new Set(["b"]))).toBeUndefined();
  });

  it("returns the object literal a name is declared as", () => {
    expect(objectOf(parse('const one = { title: "A" };\n'), "one")?.type).toBe("ObjectExpression");
  });

  it("looks through as const to the object a name is declared as", () => {
    expect(objectOf(parse('const one = { title: "A" } as const;\n'), "one")?.type).toBe(
      "ObjectExpression",
    );
  });

  it("returns nothing for a name declared as something other than an object", () => {
    expect(objectOf(parse("const one = 1;\n"), "one")).toBeUndefined();
  });

  it("returns nothing for a name the file does not declare as a variable", () => {
    expect(objectOf(parse("function one() {}\n"), "one")).toBeUndefined();
  });

  it("returns nothing for a variable declared with no initialiser", () => {
    expect(objectOf(parse("let one;\n"), "one")).toBeUndefined();
  });

  it("returns the expression under an annotation", () => {
    const scope = parse('const one = { title: "A" } satisfies Held;\n');
    const found = objectOf(scope, "one");

    expect(found === undefined ? "" : bare(found).type).toBe("ObjectExpression");
  });

  it("returns the declaration a statement makes", () => {
    expect(declarationOf(firstStatement(parse("const one = 1;\n")))?.type).toBe(
      "VariableDeclaration",
    );
  });

  it("returns nothing for an export that declares nothing of its own", () => {
    const scope = parse('export { one } from "other";\n');

    expect(declarationOf(firstStatement(scope))).toBeUndefined();
  });

  it("returns true for a value carrying a node's type", () => {
    expect(isNode({ type: "Identifier" })).toBe(true);
  });

  it("returns false for a value carrying no type", () => {
    expect(isNode({ name: "one" })).toBe(false);
  });

  it("returns the nodes among a node's members", () => {
    const scope = parse("const one = 1;\n");

    expect(childrenOf(firstStatement(scope)).length).toBeGreaterThan(0);
  });
});
