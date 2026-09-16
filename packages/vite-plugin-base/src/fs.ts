/**
 * Writes generated files without waking the watcher that watches them.
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Writes a file when its content differs from what is on disk, and reports whether it wrote.
 *
 * @remarks
 *   An identical write is skipped, which keeps a watcher from chasing the plugin's own output round
 *   a loop. A file that does not exist yet is written, and the directories above it are created.
 * @returns True when the file was written.
 */
export function writeIfChanged(at: string, content: string): boolean {
  let current: string | undefined;

  try {
    current = readFileSync(at, "utf8");
  } catch {
    current = undefined;
  }

  if (current === content) return false;

  mkdirSync(dirname(at), { recursive: true });
  writeFileSync(at, content, "utf8");

  return true;
}

/**
 * Deletes a directory and everything under it, so a generator starts from nothing.
 *
 * @remarks
 *   A directory that is absent is left absent rather than reported, so the first generation and
 *   every later one run the same code.
 */
export function emptyDir(at: string): void {
  rmSync(at, { force: true, recursive: true });
}
