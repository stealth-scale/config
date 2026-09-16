/**
 * Types the staged-files block a Vite configuration accepts.
 */

import { type UserConfig } from "vite";

/**
 * The table pairing each glob with the commands run over the staged files it
 * matches.
 */
export type Staging = NonNullable<UserConfig["staged"]>;

/**
 * One command, or several run in the order written.
 *
 * @remarks
 *   A bare string and a one-element array reach the hook runner the same way.
 *   The string form exists so the ordinary case reads as a single line.
 */
export type Runs = readonly string[] | string;
