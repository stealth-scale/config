/**
 * Where the house keeps an application's page.
 */

/**
 * The directory an application keeps its page in.
 *
 * A house convention rather than something each application decides, so that every one of them is
 * laid out the same way and none of them states it. Named here rather than inside the preset so
 * that the override taking it back names the same string the preset stated.
 *
 * Not `public`, which already means the files a build copies out untouched. An application keeps
 * both: its page here, and its `favicon.ico` and `robots.txt` where every other tool expects them.
 */
export const PAGE = "page";
