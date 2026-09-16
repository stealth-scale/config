/**
 * Supplies the scratch workspaces, manifests, measurements and plugin drivers a spec runs against,
 * and nothing an application bundle carries.
 *
 * @packageDocumentation
 */

export {
  type Configured,
  configured,
  generated,
  type Graphed,
  type HookContext,
  hookContext,
  loaded,
  resolved,
  started,
  transformed,
  updated,
} from "#hook.ts";
export { manifest, type ManifestFields, packageFiles, workspaceFiles } from "#manifest.ts";
export { type Box, type Measured, pixels, seamBetween } from "#measure.ts";
export {
  type ScratchFiles,
  type ScratchWorkspace,
  scratchWorkspace,
  withScratchWorkspace,
  withScratchWorkspaceAsync,
} from "#scratch.ts";
