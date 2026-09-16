/**
 * The task runner's own settings, as the block reaches them.
 */

import { type UserConfig } from "vite";

/**
 * What a repository states about running its tasks.
 */
export type Running = NonNullable<UserConfig["run"]>;

/**
 * One task, as the runner takes it: a command, or a command with what it reads and writes.
 */
export type Doing = NonNullable<Running["tasks"]>[string];
