/**
 * What the page runs once it has loaded.
 */

/**
 * Where the app draws.
 */
const root = document.querySelector("#root");

if (root !== null) root.textContent = `${__NAME__} ${__VERSION__}`;
