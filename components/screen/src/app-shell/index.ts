/**
 * Publishes the shell's parts, which a caller composes as `AppShell.Root` holding bars and a body,
 * and the body holding a panel down either side of `AppShell.Main`.
 */

export { Aside, type AsideProps } from "#app-shell/aside.tsx";
export { Body, type BodyProps } from "#app-shell/body.tsx";
export { Footer, type FooterProps } from "#app-shell/footer.tsx";
export { Header, type HeaderProps } from "#app-shell/header.tsx";
export { Main, type MainProps } from "#app-shell/main.tsx";
export { Navbar, type NavbarProps } from "#app-shell/navbar.tsx";
export { type Panel } from "#app-shell/panels.ts";
export { Root, type RootProps } from "#app-shell/root.tsx";
export {
  type Collapse,
  COLLAPSES,
  type Fold,
  FOLDS,
  type Side,
  useAppShellPanel,
  useNearestPanel,
  useOverlaid,
} from "#app-shell/state.ts";
export { Trigger, type TriggerProps } from "#app-shell/trigger.tsx";
export { type PanelOptions } from "#app-shell/use-panel.ts";
