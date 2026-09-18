/**
 * Draws the page: the signup form under the engine that knows the page's format and keyword, and
 * a welcome once the form passes.
 */

import { type ReactElement, useState } from "react";

import { FormNameContext } from "@stealthscale/example-form-fields";
import { FormProvider } from "@stealthscale/provider-form";

import { engine } from "#engine.ts";
import { type Signup } from "#schema.ts";
import { SignupForm } from "#signup-form.tsx";
import { words } from "#words.ts";

/**
 * Draws the page with the engine in scope, and welcomes the person once the form passes.
 */
export function App(): ReactElement {
  const [done, setDone] = useState<Signup>();

  return (
    <FormProvider engine={engine} translate={words}>
      <main>
        <h1>Sign up</h1>
        <FormNameContext value="signup">
          {done === undefined ? (
            <SignupForm onDone={setDone} />
          ) : (
            <output>Welcome, {done.username}</output>
          )}
        </FormNameContext>
      </main>
    </FormProvider>
  );
}
