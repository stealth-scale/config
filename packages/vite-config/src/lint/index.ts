/**
 * Publishes the lint presets and the departures written beside them.
 *
 * @remarks
 *   The rule groups stay behind this boundary. A repository names the rule it
 *   wants changed and states why, rather than importing a group and editing it.
 */

export {
  barrelled,
  defaultExported,
  enforce,
  forbid,
  type Forbidden,
  type LintOverride,
  relax,
  type Ruled,
  specified,
  undocumented,
} from "#lint/departure.ts";
export * as preset from "#lint/preset.ts";
