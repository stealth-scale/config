---
"@stealthscale/testing-router": minor
---

testing-router: add the helpers a specification mounts a route tree with

- `mountRoute` takes a tree and a path, builds a router over it, reads the map every link resolves
  through out of the same tree, waits for everything the path loads, and renders it. A specification
  reads a screen rather than driving a router.
- `mountRouter` takes a router instead, for an application that decides what its own router holds,
  such as one built for a session. `routerOver` builds the router without rendering it, for a case
  that reads `routesById` or a resolved path.
- A router loads its matches before anything renders them. Rendering first draws the page the router
  was on rather than the page the path names, and nothing reports it. Each helper does the three
  steps in order, so the trap is written once here rather than at every site.
- Preloading is off in a mounted router, so a link in the rendered page fetches nothing on its own.
- Each call builds a router of its own. Two cases sharing one would navigate each other, and the
  library caches a processed tree keyed by the tree's identity.
