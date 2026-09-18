import { type ReactElement, type ReactNode, useId } from "react";

import { useFieldContext, useFormContext } from "#contexts.ts";
import { type CellProps, type GroupProps, type ItemProps, type StepProps } from "#layouts.ts";
import { choicesOf, textOf } from "#property.ts";
import { useProperty } from "#use-property.ts";
import { useWords } from "#words.ts";

interface FieldProps {
  readonly required?: boolean | undefined;
}

interface Bound<Value> {
  readonly handleBlur: () => void;
  readonly handleChange: (value: Value) => void;
  readonly name: string;
  readonly state: {
    readonly meta: { readonly errors: readonly unknown[]; readonly isTouched: boolean };
    readonly value: Value;
  };
}

/**
 * Reads the field in scope typed over the value it holds, as a component package's own hook does.
 */
function useBound<Value>(): Bound<Value> {
  return useFieldContext<Value>();
}

interface FrameProps extends FieldProps {
  readonly children: (attributes: {
    "aria-invalid": boolean;
    "aria-required": boolean;
    id: string;
    name: string;
  }) => ReactNode;
}

/**
 * Draws the label and the first error around a control, as a component package's frame does.
 */
function Frame({ children, required = false }: FrameProps): ReactElement {
  const field = useBound<unknown>();
  const { schema } = useProperty();
  const words = useWords();
  const id = useId();
  const [error] = field.state.meta.errors;
  const shown = field.state.meta.isTouched && error !== undefined;

  return (
    <div className="field">
      <label htmlFor={id}>
        {words.label(field.name, schema === undefined ? undefined : textOf(schema, "title"))}
      </label>
      {children({ "aria-invalid": shown, "aria-required": required, id, name: field.name })}
      {shown ? <p role="alert">{words.error(field.name, error)}</p> : null}
    </div>
  );
}

export function TextField({ required }: FieldProps): ReactElement {
  const field = useBound<string>();
  const { schema } = useProperty();
  const format = schema === undefined ? undefined : schema["format"];
  const type = format === "email" || format === "password" ? format : "text";

  return (
    <Frame required={required}>
      {(attributes) => (
        <input
          {...attributes}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          type={type}
          value={field.state.value}
        />
      )}
    </Frame>
  );
}

export function NumberField({ required }: FieldProps): ReactElement {
  const field = useBound<number>();

  return (
    <Frame required={required}>
      {(attributes) => (
        <input
          {...attributes}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.valueAsNumber);
          }}
          type="number"
          value={field.state.value}
        />
      )}
    </Frame>
  );
}

export function CheckboxField({ required }: FieldProps): ReactElement {
  const field = useBound<boolean>();

  return (
    <Frame required={required}>
      {(attributes) => (
        <input
          {...attributes}
          checked={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.checked);
          }}
          type="checkbox"
        />
      )}
    </Frame>
  );
}

export function SelectField({ required }: FieldProps): ReactElement {
  const field = useBound<string>();
  const { schema } = useProperty();
  const words = useWords();

  return (
    <Frame required={required}>
      {(attributes) => (
        <select
          {...attributes}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          value={field.state.value}
        >
          <option value="">Choose</option>
          {(schema === undefined ? [] : choicesOf(schema)).map((choice) => (
            <option key={choice} value={choice}>
              {words.option(field.name, choice)}
            </option>
          ))}
        </select>
      )}
    </Frame>
  );
}

export function Cell({ children, span }: CellProps): ReactNode {
  return span === undefined ? children : <div className={`span-${span}`}>{children}</div>;
}

export function Group({
  children,
  closed,
  columns,
  direction,
  legend,
  onAdd,
}: GroupProps): ReactElement {
  const words = useWords();
  const layout = columns === undefined ? (direction ?? "column") : `grid columns-${columns}`;
  const inner = (
    <>
      <div className={layout}>{children}</div>
      {onAdd === undefined ? null : (
        <button onClick={onAdd} type="button">
          {words.action("add", "Add")}
        </button>
      )}
    </>
  );

  if (legend === undefined) return inner;

  if (closed === true) {
    return (
      <details>
        <summary>{legend}</summary>
        {inner}
      </details>
    );
  }

  return (
    <fieldset>
      <legend>{legend}</legend>
      {inner}
    </fieldset>
  );
}

export function Item({ children, index, onRemove }: ItemProps): ReactElement {
  const words = useWords();

  return (
    <div className="item" data-index={index}>
      {children}
      {onRemove === undefined ? null : (
        <button onClick={onRemove} type="button">
          {words.action("remove", "Remove")}
        </button>
      )}
    </div>
  );
}

export function Step({ children, current, kind, labels, onGo }: StepProps): ReactElement {
  const words = useWords();
  const last = current === labels.length - 1;

  return (
    <div className={kind}>
      <h2>{labels[current]}</h2>
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
          <Submit>{words.action("submit", "Save")}</Submit>
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

export function Form({ children }: { readonly children?: ReactNode }): ReactElement {
  const form = useFormContext();

  return (
    <form
      id={form.formId}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      {children}
    </form>
  );
}

export function Submit({ children = "Submit" }: { readonly children?: ReactNode }): ReactElement {
  return <button type="submit">{children}</button>;
}
