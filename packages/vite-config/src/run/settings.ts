/**
 * Describes the shapes the task-runner block of a Vite configuration accepts.
 */

import { type UserConfig } from "vite";

/**
 * The cache, the task table and the script lifecycle a workspace root declares
 * for the runner.
 */
export type Running = NonNullable<UserConfig["run"]>;

/**
 * One task, written as its command alone or as a record naming that command
 * with its files.
 *
 * @remarks
 *   A record that names inputs while declaring itself uncached fails to
 *   typecheck, because there is then nothing for a fingerprint to be taken of.
 *   Naming neither leaves the task running every time it is invoked.
 */
export type Doing = NonNullable<Running["tasks"]>[string];
