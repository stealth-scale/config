/**
 * Declares to i18next which namespaces exist and what `t` returns.
 *
 * The catalogue plugin writes a declaration file per project that adds one member here per
 * namespace, typed from the fallback language. This module is the only place i18next learns about
 * them, so an unknown key and a dropped placeholder are both editor errors.
 */

/**
 * Every namespace an application can reach, typed from the fallback language.
 *
 * @remarks
 *   Empty here. The catalogue plugin adds the members in `i18n.gen.d.ts`. Augment this by hand only
 *   in a project the plugin does not run in.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmented per project
export interface Resources {}

declare module "i18next" {
  /**
   * The options i18next resolves a key and a return type against.
   */
  interface CustomTypeOptions {
    /**
     * No default namespace, so every call names the namespace it reads. That is what keeps a
     * package's strings its own.
     */
    defaultNS: false;

    /**
     * The namespaces and their keys.
     */
    resources: Resources;

    /**
     * A key with no string resolves to the key rather than to null, so `t` always returns a string.
     */
    returnNull: false;
  }
}
