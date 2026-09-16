/**
 * A component library shared by more than one application.
 *
 * @remarks
 *   React is a peer dependency, so a host and a remote that both use this
 *   library run against the single copy the host installed. Two copies would
 *   give a component two dispatchers, and a hook called against the wrong one
 *   throws at render.
 * @packageDocumentation
 */

export { Panel, type PanelProps } from "#panel.tsx";
