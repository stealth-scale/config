/**
 * Supplies the scratch workspaces, manifests and measurements a spec runs against, and nothing an
 * application bundle carries.
 *
 * @packageDocumentation
 */

export { manifest, type ManifestFields, packageFiles, workspaceFiles } from "#manifest.ts";
export { type Box, type Measured, pixels, seamBetween } from "#measure.ts";
export {
  type ScratchFiles,
  type ScratchWorkspace,
  scratchWorkspace,
  withScratchWorkspace,
  withScratchWorkspaceAsync,
} from "#scratch.ts";
