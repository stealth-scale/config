/**
 * Walks a block of tokens, however deep it nests, and tells a token from the group around it.
 */

/**
 * Describes one token found in a block: where it is, and what it holds.
 */
export interface Leaf {
  /**
   * The dotted path from the block to the token.
   */
  path: string;

  /**
   * The token's value: a string, or one value per mode.
   */
  value: unknown;
}

/**
 * Reports whether a node is a token, which is an object carrying a value.
 */
export function isToken(node: unknown): boolean {
  return typeof node === "object" && node !== null && "value" in node;
}

/**
 * Lists every token under a block with its dotted path, in the order the block states them.
 *
 * @remarks
 *   A group is any object that is not a token, so a palette's nested roles and a family's members
 *   are reached alike. A value that is neither is passed over.
 */
export function leaves(block?: unknown, prefix = ""): readonly Leaf[] {
  if (typeof block !== "object" || block === null) return [];

  return Object.entries(block).flatMap(([name, node]) => {
    const path = prefix === "" ? name : `${prefix}.${name}`;

    if (isToken(node)) return [{ path, value: Reflect.get(node, "value") }];

    return leaves(node, path);
  });
}

/**
 * Reads the node a dotted path reaches, or undefined where the path leaves the block.
 */
export function nodeAt(block: unknown, path: string): unknown {
  let node = block;

  for (const name of path.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;

    node = Reflect.get(node, name);
  }

  return node;
}

/**
 * Reports whether a dotted path reaches a token, either outright or as a group's own value.
 */
export function stated(block: unknown, path: string): boolean {
  const node = nodeAt(block, path);

  return isToken(node) || isToken(nodeAt(node, "DEFAULT"));
}

/**
 * Writes a file name in camel case, which is the key a recipe or an extension is listed under.
 */
export function camelCased(name: string): string {
  return name.replaceAll(/-([a-z0-9])/gu, (_match, letter: string) => letter.toUpperCase());
}
