/**
 * Gives a spec a directory tree of its own under the system temporary directory.
 *
 * @remarks
 *   A spec owns everything it writes there, so it may assert an exact file count and exact names.
 *   Every relative path is resolved against the root before it is used, and one that escapes throws
 *   instead of reaching the real file system.
 */

import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";

/**
 * File contents keyed by a path relative to the workspace root.
 *
 * @remarks
 *   A separator in a key creates the directories above the file. An empty string is content like
 *   any other and writes an empty file.
 */
export type ScratchFiles = Readonly<Record<string, string>>;

/**
 * Collects the files below a directory as paths relative to where the walk began.
 *
 * @remarks
 *   A directory contributes its contents and never an entry of its own, so a caller comparing two
 *   listings cannot see an empty directory in either. A symbolic link is listed as a file whatever
 *   it points at.
 */
function walk(directory: string, prefix: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(join(directory, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`],
  );
}

/**
 * A directory a spec owns for the length of one test.
 *
 * @remarks
 *   Nothing deletes the directory on its own. A spec holding an instance directly is the one that
 *   has to call {@link ScratchWorkspace.remove}, and {@link withScratchWorkspace} exists so that it
 *   does not have to.
 */
export class ScratchWorkspace {
  /**
   * The absolute path of the directory this workspace owns.
   */
  readonly root: string;

  /**
   * Adopts a directory that already exists.
   *
   * @remarks
   *   The directory is neither created nor emptied here, and whatever it already holds stays.
   *   {@link scratchWorkspace} is the way to get a fresh one.
   * @param root - An absolute path. A relative one leaves every path inside the workspace
   *   resolving elsewhere, and {@link ScratchWorkspace.path} then rejects all of them.
   */
  constructor(root: string) {
    this.root = root;
  }

  /**
   * Lists every file in the workspace, sorted by path.
   *
   * @remarks
   *   The tree is walked on each call, so the listing carries a write made a moment earlier. A
   *   directory holding no files is absent from the listing.
   * @returns Each path relative to the root, separated by `/`.
   */
  files(): string[] {
    return walk(this.root, "").toSorted();
  }

  /**
   * Resolves a relative path against the root and refuses one that leaves the workspace.
   *
   * @remarks
   *   The refusal reads the resolved string, so `..` segments that cancel each other out are
   *   accepted. A symbolic link inside the workspace is never followed and passes whatever it
   *   points at.
   * @returns The absolute path, which for `.` is the root itself.
   * @throws {@link Error} When the path resolves outside the root.
   */
  path(relative: string): string {
    const target = resolve(this.root, relative);
    if (target !== this.root && !target.startsWith(this.root + sep)) {
      throw new Error(`${relative} leaves the scratch workspace`);
    }
    return target;
  }

  /**
   * Reads a file in the workspace as UTF-8 text.
   *
   * @throws {@link Error} Carrying the code `ENOENT` when the file is absent, and without a code
   *   when the path leaves the workspace.
   */
  read(relative: string): string {
    return readFileSync(this.path(relative), "utf8");
  }

  /**
   * Deletes the workspace directory and everything below it.
   *
   * @remarks
   *   A second call does nothing rather than throwing, so a spec that removes the workspace in the
   *   body and again in a teardown is safe. The instance stays usable and every read after this
   *   throws.
   */
  remove(): void {
    rmSync(this.root, { force: true, recursive: true });
  }

  /**
   * Writes each file into the workspace, creating the directories above it.
   *
   * @remarks
   *   An existing file is overwritten and no other file is touched, so a second call adds to the
   *   tree rather than replacing it. The entries are written in the order the object lists them,
   *   and one that leaves the workspace throws with the earlier entries already on disk.
   */
  write(files: ScratchFiles): void {
    for (const [relative, content] of Object.entries(files)) {
      const target = this.path(relative);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
  }
}

/**
 * Makes a workspace of its own under the system temporary directory and fills it.
 *
 * @remarks
 *   Two calls never collide, because the operating system supplies the last part of the directory
 *   name. Nothing schedules the cleanup, so a caller that never reaches
 *   {@link ScratchWorkspace.remove} leaves the tree behind until the machine clears its temporary
 *   directory.
 */
export function scratchWorkspace(files: ScratchFiles = {}): ScratchWorkspace {
  const workspace = new ScratchWorkspace(mkdtempSync(join(tmpdir(), "stealth-")));
  workspace.write(files);
  return workspace;
}

/**
 * Runs a function against a fresh workspace and deletes the directory once it returns.
 *
 * @remarks
 *   The directory goes whether the function returns or throws, and an error reaches the caller
 *   unchanged. A function that returns a promise is not awaited and loses its directory while it is
 *   still running, which is the case {@link withScratchWorkspaceAsync} covers.
 * @returns The value the function produced.
 * @throws {@link Error} Any error the function threw, raised after the directory is deleted.
 */
export function withScratchWorkspace<Result>(
  files: ScratchFiles,
  run: (workspace: ScratchWorkspace) => Result,
): Result {
  const workspace = scratchWorkspace(files);
  try {
    return run(workspace);
  } finally {
    workspace.remove();
  }
}

/**
 * Awaits a function against a fresh workspace and deletes the directory once it settles.
 *
 * @remarks
 *   The directory stands until the function's promise settles, so the function may read and write
 *   across any number of awaits. Work it starts and does not await still loses the directory under
 *   it.
 * @returns The value the function resolved to.
 * @throws {@link Error} Any error the function rejected with, raised after the directory is
 *   deleted.
 */
export async function withScratchWorkspaceAsync<Result>(
  files: ScratchFiles,
  run: (workspace: ScratchWorkspace) => Promise<Result>,
): Promise<Result> {
  const workspace = scratchWorkspace(files);
  try {
    return await run(workspace);
  } finally {
    workspace.remove();
  }
}
