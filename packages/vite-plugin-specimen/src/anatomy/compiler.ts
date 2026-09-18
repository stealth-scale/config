/**
 * Runs TypeScript's own compiler over the workspace and keeps it open across the pages a catalogue
 * asks for.
 *
 * @remarks
 *   The props a component accepts cannot be read off the component. One built by a factory reports
 *   two props at run time and neither is its own, and the exported `*Props` type is the thing that
 *   knows. Resolving it needs a checker, so this starts one process and holds its projects between
 *   reads. The compiler is loaded when a page first asks for props, so a catalogue that reads none
 *   never starts it and an installation without TypeScript still indexes.
 */

import { anatomyOf } from "#anatomy/props.ts";
import { type Settled } from "#anatomy/reading.ts";
import { type Symbol as Named, type Project, type Snapshot } from "#anatomy/types.ts";
import { sure } from "#anatomy/walk.ts";
import { type Anatomy } from "#contract.ts";

/**
 * Describes the compiler while it is open.
 */
export interface Compiler {
  /**
   * Reads one specimen's parts and what they accept.
   *
   * @throws {@link Error} When no project holds the specimen.
   */
  anatomyOf: (specimen: string, stated: Settled) => Anatomy;

  /**
   * Stops the compiler.
   */
  close: () => void;

  /**
   * Forgets every file read, so the next read starts a compiler that sees the files as they are.
   *
   * @remarks
   *   A snapshot answers a file from the text it first read, whatever it is told about a change.
   *   Restarting costs tens of milliseconds and is cheaper than answering from stale text.
   */
  restart: () => void;
}

/**
 * Describes what one running compiler holds.
 */
interface Running {
  /**
   * The process.
   */
  api: InstanceType<typeof import("typescript/unstable/sync").API>;

  /**
   * The files opened so far, each of which put its project in the snapshot.
   */
  opened: Set<string>;

  /**
   * The snapshot every answer comes from.
   */
  snapshot: Snapshot;
}

/**
 * Starts the compiler and returns it open.
 *
 * @param cwd - Where the compiler runs, which is where it looks for projects.
 * @throws {@link Error} When TypeScript is not installed.
 */
export async function compiler(cwd: string): Promise<Compiler> {
  const { API, SignatureKind, SymbolFlags } = await import("typescript/unstable/sync");
  const { isImportDeclaration } = await import("typescript/unstable/ast/is");
  const enumerated = {
    alias: SymbolFlags.Alias,
    call: SignatureKind.Call,
    optional: SymbolFlags.Optional,
    value: SymbolFlags.Value,
  };
  let running: Running | undefined;

  /**
   * Returns the running compiler, starting one where none runs.
   */
  function started(): Running {
    if (running === undefined) {
      const api = new API({ cwd });

      running = { api, opened: new Set(), snapshot: api.updateSnapshot() };
    }

    return running;
  }

  /**
   * Returns the project holding a specimen, opening the file where it is not open yet.
   *
   * @throws {@link Error} When no project holds the file.
   */
  function projectOf(specimen: string): Project {
    const held = started();

    if (!held.opened.has(specimen)) {
      held.opened.add(specimen);
      held.snapshot.dispose();
      held.snapshot = held.api.updateSnapshot({ openFiles: [specimen] });
    }

    return sure(held.snapshot.getDefaultProjectForFile(specimen), `a project holding ${specimen}`);
  }

  /**
   * Returns the modules a specimen imports, as the compiler resolved them.
   */
  function imports(project: Project, specimen: string): readonly Named[] {
    const source = sure(project.program.getSourceFile(specimen), `the source of ${specimen}`);

    return source.statements.flatMap((statement) => {
      if (!isImportDeclaration(statement)) return [];

      const module = project.checker.getSymbolAtLocation(statement.moduleSpecifier);

      return module === undefined ? [] : [module];
    });
  }

  /**
   * Stops the running compiler, where one runs.
   */
  function stop(): void {
    running?.snapshot.dispose();
    running?.api.close();
    running = undefined;
  }

  return {
    anatomyOf: (specimen, stated) =>
      anatomyOf(projectOf(specimen), specimen, { enumerated, imports, stated }),

    close: stop,

    restart: stop,
  };
}
