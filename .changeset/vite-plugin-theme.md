---
"@stealthscale/vite-plugin-theme": patch
---

vite-plugin-theme: complete a theme with the tokens the themes disagree on alone

- A theme's variant is completed with the foundation's value for each token another theme states and
  it leaves unstated, and for no other. A token no theme states has the foundation's value
  everywhere already, so restating every token under every theme doubled the gzipped stylesheet for
  nothing. `stated(variants)` lists the tokens any theme states, and `completed` takes that shape.
