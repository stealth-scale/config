/**
 * What `vp staged` reads, as the block reaches it.
 */

import { type UserConfig } from "vite-plus";

/**
 * A glob against what to run on the staged files matching it.
 */
export type Staging = NonNullable<UserConfig["staged"]>;

/**
 * What runs on one set of staged files: a command, or several in order.
 */
export type Runs = readonly string[] | string;
