---
"@stealthscale/vite-config": minor
"@stealthscale/vite-config-react": minor
---

Keep an application's page where Vite looks for it

`layout.page` set the build input and nothing else, so the two halves of an application disagreed:
the dev server reads `index.html` from the project root, which no layer moved. An application laid
out the way the house asked for it served a 404 at the URL the dev server printed, and one laid out
so that development worked could not be built at all.

Both are gone, along with `react.override.page`, which existed only to move the same directory. An
application keeps `index.html` beside its config, where Vite looks for it and where every other Vite
project keeps it. A build writes `dist/index.html` rather than `dist/page/index.html`.

**Moving an application over:** move `page/index.html` up to the package root and change the script
path inside it from `../src/…` to `./src/…`. Drop any `layout.page(…)` or `react.override.page(…)`
from the config. Whatever serves the build now points at the output directory rather than a
directory inside it.
