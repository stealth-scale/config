/**
 * What a machine says about how the servers on it are reached.
 *
 * Not a block of the config: nothing here is a key Vite reads. It is where the `server` and
 * `preview` blocks get their answers when a repository states none, so that the two agree and
 * neither writes a machine's arrangement into the repository.
 *
 * Read while the configuration is loaded, which is node. What a browser reads cannot come from here
 * — `import.meta.env` is substituted into the bundle while it is built, so a value that reached a
 * page that way is fixed at build time and the artefact is one per environment.
 */

export { bound, hosts, origins } from "#serving/environment.ts";
