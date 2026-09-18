# @stealthscale/example-router-guarded

Routes only where a condition holds. Three report pages: one anybody may read, one for somebody
signed in, and one for somebody holding a permission.

```bash
pnpm --filter @stealthscale/example-router-guarded dev
```

## The condition is this application's own

The foundation states nothing about what a condition may say. It takes an evaluator, and the
condition type travels with it.

```ts
export type Condition = Permitted | SignedIn;
```

`evaluate.ts` builds the evaluator for one session. Returning false makes the route a 404, because a
route nobody may reach does not exist. A refusal page would confirm the page is there to somebody
who may not know.

```ts
export function evaluator(session: Session): Evaluate<Condition> {
  return (when) => {
    if (when.kind === "signedIn" && !session.signedIn) {
      throw redirect({ to: "/sign-in" });
    }

    return holds(session, when);
  };
}
```

Somebody who has not signed in is the one case that is not a 404, and the evaluator throws that
redirect itself. It alone knows which condition failed. Sending every refusal to a sign-in page
would tell a signed-in reader that a page they may not read exists.

## A condition decides routing, not compiling

Every page is in the tree whoever is reading. The evaluator runs when somebody opens one, so a
session that changes needs no rebuild.

A menu drawn from the declarations therefore lists every page, including ones the reader would be
refused. Filter the declarations with the same evaluator before drawing it. The foundation leaves
that alone, because which entries a person should be offered is a question about an application
rather than about routing.

## Reading which page you are on

One component serves all three pages. `useDeclaredRoute` reads which route it is drawing off the
match, which the compiler named rather than the page having to be told. It returns nothing on a
route nobody named.

The sign-in page is written in code and carries `namedRoute("app.signIn")`, so it is named the same
way a declared page is and a link reaches it by id.
