/**
 * Writes generated files without waking the watcher that watches them.
 */

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

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

/**
 * Lists every file under a directory as a path relative to it, and nothing where the directory is
 * absent.
 */
function filesUnder(at: string): readonly string[] {
  try {
    return readdirSync(at, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => relative(at, join(entry.parentPath, entry.name)));
  } catch {
    return [];
  }
}

/**
 * Lists every directory under a directory as an absolute path, the deepest first, and nothing
 * where the directory is absent.
 *
 * @remarks
 *   A directory's path is longer than its parent's, so sorting by length puts a directory before
 *   the one holding it. Deleting in that order empties a parent before it is looked at.
 */
function directoriesUnder(at: string): readonly string[] {
  try {
    return readdirSync(at, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(entry.parentPath, entry.name))
      .toSorted((one, other) => other.length - one.length);
  } catch {
    return [];
  }
}

/**
 * Makes one directory hold exactly the files of another, writing only what differs.
 *
 * @remarks
 *   A generator that empties its output and writes everything again touches every file, and a
 *   watcher then reloads every module behind them. Writing through {@link writeIfChanged} and
 *   deleting only what the source no longer holds leaves an unchanged file as it was, so the
 *   watcher sees the files that changed and no others. A directory left empty by a deletion is
 *   deleted with it.
 */
export function syncDir(from: string, to: string): void {
  const wanted = new Set(filesUnder(from));

  for (const file of wanted) writeIfChanged(join(to, file), readFileSync(join(from, file), "utf8"));

  for (const file of filesUnder(to)) {
    if (!wanted.has(file)) rmSync(join(to, file), { force: true });
  }

  for (const directory of directoriesUnder(to)) {
    if (readdirSync(directory).length === 0) rmSync(directory, { recursive: true });
  }
}
