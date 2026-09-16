#!/usr/bin/env node

/**
 * Runs the totaller from a shell and reports the outcome through the exit code.
 *
 * @remarks
 *   A total is written to stdout and an explanation to stderr, so a pipeline
 *   reads the number without the prose. A refused argument exits 1, which is
 *   what a shell tests, and the message names the argument that was refused.
 */

import { argv, exit, stderr, stdout } from "node:process";

import { tally } from "#totals.ts";

try {
  stdout.write(`${tally(argv.slice(2))}\n`);
} catch (error) {
  stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  exit(1);
}
