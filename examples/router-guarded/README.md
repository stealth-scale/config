# @stealthscale/example-router-guarded

Routes only where a condition holds. Three report pages: one anybody may read, one for somebody
signed in, and one for somebody holding a permission.

```bash
pnpm --filter @stealthscale/example-router-guarded dev
```

The server listens on <http://localhost:4942>. The site root redirects to the page anybody may read,
resolved through the route map rather than written down as a path. The shell above every page holds
a link to each report and a control that switches between three readers, so the refusals are visible
without signing anything in.

| Reader    | `/summary` | `/mine`  | `/audit`  |
| --------- | ---------- | -------- | --------- |
| Anonymous | the page   | sign in  | not found |
| Signed in | the page   | the page | not found |
| Auditor   | the page   | the page | the page  |

## The condition is this application's own

The foundation states nothing about what a condition may say. It takes an evaluator, and the
condition type is carried with it.

```ts
export type Condition = Permitted | SignedIn;
```

`evaluate.ts` builds the evaluator for one session. Returning false makes the route a 404. A refusal
page would confirm to somebody who may not know that the page exists.

```ts
export function evaluator(read: () => Session): Evaluate<Condition> {
  return (when) => {
    const reading = read();

    if (when.kind === "signedIn" && !reading.signedIn) {
      throw redirect({ to: "/sign-in" });
    }

    return holds(reading, when);
  };
}
```

Somebody who has not signed in is the one case that is not a 404, and the evaluator throws that
redirect itself. The evaluator alone knows which condition failed. Sending every refusal to a
sign-in page would tell a signed-in reader that a page they may not read exists.

The evaluator takes a call rather than a session, so it reads who is reading at the moment a
condition is asked. `shell.tsx` records the new reader and calls `router.invalidate()`, which runs
every check again for the page a person is already on.

## A condition decides routing, not compiling

Every page is in the tree whoever the reader is. The evaluator runs when somebody opens one, so a
session that changes needs no rebuild.

The menu therefore lists every page, including the ones the reader would be refused. This example
leaves them all in so that a refusal is something you can click on. An application that should show
fewer filters the declarations itself with `holds`, not with the evaluator, because the evaluator
throws a redirect rather than returning a result. The foundation does neither, because which entries
a person should be offered is a question about an application rather than about routing.

## Reading which page you are on

One component serves all three pages. `useDeclaredRoute` reads which route it is drawing off the
match, which the compiler named, rather than the page being passed its own identity. It returns
nothing on a route nobody named.

The sign-in page is written in code and carries `namedRoute("app.signIn")`, so it is named the same
way a declared page is and a link reaches it by id.
