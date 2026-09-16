/**
 * Writes the package name and version into the page this example serves.
 *
 * @remarks
 *   Both values are substituted as string literals while the bundle is built, so
 *   the page shows them without reading a manifest at run time. A document that
 *   carries no #root is left as it was found instead of throwing, which keeps the
 *   script harmless in a host supplying its own markup.
 */

/**
 * The element index.html offers for the build stamp.
 */
const root = document.querySelector("#root");

if (root !== null) root.textContent = `${__NAME__} ${__VERSION__}`;
