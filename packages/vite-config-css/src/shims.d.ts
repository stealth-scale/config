/**
 * Declares the shape of the shared Stylelint configuration, which ships no
 * types of its own.
 */

declare module "stylelint-config-standard" {
  /**
   * Describes the shared guide the rule sets in this package are layered over.
   */
  const config: {
    /**
     * The configuration this one is itself built on, as a package specifier.
     */
    extends: string;

    /**
     * Every rule the shared guide turns on, by Stylelint rule name.
     */
    rules: Record<string, unknown>;
  };

  export default config;
}
