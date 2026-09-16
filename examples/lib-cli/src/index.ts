/**
 * A library that ships a command alongside the function behind it.
 *
 * @remarks
 *   The command and this entry point are separate export conditions, so
 *   importing the package never runs the command's argument parsing, and a
 *   consumer that only wants `tally` pays nothing for the binary.
 * @packageDocumentation
 */

export { tally } from "#totals.ts";
