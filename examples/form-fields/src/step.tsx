/**
 * Draws the step of a generated form a person is on, with the controls that move between steps.
 */

import { type ReactElement } from "react";

import { type StepProps, useWords } from "@stealthscale/provider-form";

import { Submit } from "#submit.tsx";

/**
 * Draws the step being drawn under its label.
 *
 * @remarks
 *   A wizard draws a way back from every step but the first, a way forward from every step but
 *   the last, and the submit on the last. Tabs draw every label as a button as well. The words
 *   read `<id>.actions.back`, `<id>.actions.next` and `<id>.actions.submit`. The root element
 *   carries the id the foundation gives it, and the heading takes focus before the first field,
 *   so a person moving to a step hears its name first.
 */
export function Step({ children, current, id, kind, labels, onGo }: StepProps): ReactElement {
  const words = useWords();
  const last = current === labels.length - 1;

  return (
    <div className={kind} id={id}>
      <h2 tabIndex={-1}>{labels[current]}</h2>
      {kind === "tabs" ? (
        <nav>
          {labels.map((label, index) => (
            <button
              aria-current={index === current}
              key={label}
              onClick={() => {
                onGo(index);
              }}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>
      ) : null}
      {children}
      <p className="steps">
        {current > 0 ? (
          <button
            onClick={() => {
              onGo(current - 1);
            }}
            type="button"
          >
            {words.action("back", "Back")}
          </button>
        ) : null}
        {last ? (
          <Submit>{words.action("submit", "Submit")}</Submit>
        ) : (
          <button
            onClick={() => {
              onGo(current + 1);
            }}
            type="button"
          >
            {words.action("next", "Next")}
          </button>
        )}
      </p>
    </div>
  );
}
