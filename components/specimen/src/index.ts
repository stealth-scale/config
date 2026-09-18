/**
 * Declares what a page of a catalogue is, and draws a component once per value of an axis.
 *
 * @remarks
 *   A specimen file's default export is `specimen()`, which the index plugin parses out of the
 *   source without evaluating the module. Every part a matrix draws is a component of the library,
 *   so the package states no recipe and a theme that moves the library moves the catalogue with it.
 * @packageDocumentation
 */

export * from "#matrix/index.ts";
export { scene, type Scene, specimen, type Specimen } from "#page.ts";
