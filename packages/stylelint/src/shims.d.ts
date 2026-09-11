/**
 * What the shared stylelint config is, since it ships no types of its own.
 *
 * Narrowed to the two fields this package reads, because a wider declaration would be a guess.
 */
declare module "stylelint-config-standard" {
  /**
   * The shared config, as stylelint reads it.
   */
  const config: {
    /**
     * The config it is itself built on.
     */
    extends: string;

    /**
     * Each rule it states, against what it asks for.
     */
    rules: Record<string, unknown>;
  };

  export default config;
}
