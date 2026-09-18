# @stealthscale/example-router-federated

Routes to pages another deployment declares, at the addresses that deployment states. This
application owns one page and reads the rest when it starts.

```bash
pnpm --filter @stealthscale/example-router-federated dev
```

The other deployment is `@stealthscale/example-app-remote`. Run both, and the host serves its own
page at `/` and the remote's at wherever the remote said.

## The address belongs to whoever owns the page

The remote states where its pages belong, beside the module that draws them.

```ts
export function routes(): readonly RouteDeclaration[] {
  return [
    {
      component: { export: "Reports", load: () => import("#reports.tsx") },
      id: "remote.dashboard",
      navigation: { label: "Reports" },
      path: "/reports",
    },
  ];
}
```

The host reads that at boot and compiles it. No path for the remote's page appears anywhere in this
application, so redeploying the remote under a different one does not rebuild this application.

```ts
const compiled = compileRoutes(declarations, { parent: root });
```

`federation.host` already names the remote without giving an address. It reads where the remote is
deployed from a document fetched at run time. The page's address was the last part still hardcoded,
and it was hardcoded in the wrong application.

## A deployment that is missing costs one page

`declarations.ts` returns an empty list where the import fails. The host still routes everything it
owns, and reports once that the other deployment declared nothing.

```ts
try {
  const remote = await import("remote/routes");

  return remote.routes();
} catch (error: unknown) {
  globalThis.console.warn("The other deployment declared no pages.", error);

  return [];
}
```

Declarations are read before the router is built, because the tree is a function of them. The
importer in each declaration keeps that cheap: a page's own chunk still loads on the first
navigation to it rather than at boot.

## Under test

The runner has no second deployment to fetch from. The federation layer aliases `remote/routes` to
`remote.fixtures.ts`, the same way it aliased the component before, so a case checks that this
application mounts the page where the declaration asked rather than where this application chose.
