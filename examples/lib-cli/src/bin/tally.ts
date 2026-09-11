#!/usr/bin/env node

/**
 * The command this package installs.
 */

import { argv, exit, stderr, stdout } from "node:process";

import { tally } from "#totals.ts";

try {
  stdout.write(`${tally(argv.slice(2))}\n`);
} catch (error) {
  stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  exit(1);
}
