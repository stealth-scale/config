---
"@stealthscale/vite-plugin-specimen": minor
---

add the specimen index plugin

- Parse `id`, `group`, `title` and `about` out of a specimen's default export.
- Serve `virtual:specimen-index` as one listing per file with a dynamic import per page, and
  `virtual:specimen-fragments/<id>` as one snippet per scene.
- Serve both without a source map, which was four fifths of the payload.
- List a file that declares no page with the reason as its opening and a rejecting loader, and throw
  on a build instead.
- Refuse the second of two files declaring one identifier and name the first.
- Reload the index when a page appears, disappears, or changes its metadata, and leave it alone when
  an edit changes only a scene.

138 tests, 100% on all four metrics.
