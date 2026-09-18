import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen } from "@stealthscale/specimen";
import { LIFTED, LOOKS, SCALE, STATUSES } from "@stealthscale/theme/authoring";

import { Button } from "#button/button.ts";
import { IconButton } from "#button/icon-button.ts";

const VARIANTS = [...LOOKS, "glass"] as const;

const SHOWN = ["solid", "subtle", "outline"] as const;

const PRESSED = [false, true] as const;

const CHECK = "M20 6 9 17l-5-5";

export const looks: Scene = {
  about:
    "Every look the vocabulary offers, and the `glass` layer style the button adds beside them. A look reads the palette rather than a colour, so a status or a theme moves all of them at once.",
  draw: () => (
    <Matrix direction="row" knob="variant" of={VARIANTS}>
      {(variant) => <Button variant={variant}>Publish</Button>}
    </Matrix>
  ),
  title: "Looks",
};

export const sizes: Scene = {
  about:
    "The control steps every other control in the library shares, so a button in a row of fields lines up with them.",
  draw: () => (
    <Matrix direction="row" knob="size" of={SCALE}>
      {(size) => <Button size={size}>Publish</Button>}
    </Matrix>
  ),
  title: "Sizes",
};

export const statuses: Scene = {
  about:
    "A status points the palette at the semantic palette of its name and sets nothing else, so the look decides how that palette is drawn.",
  draw: () => (
    <Matrix knob="status" of={STATUSES}>
      {(status) => (
        <Matrix direction="row" knob="variant" of={SHOWN}>
          {(variant) => (
            <Button status={status} variant={variant}>
              Retry
            </Button>
          )}
        </Matrix>
      )}
    </Matrix>
  ),
  title: "Statuses",
};

export const elevation: Scene = {
  about: "A lifted button rises under a pointer and drops towards the page under a press.",
  draw: () => (
    <Matrix direction="row" knob="elevation" of={LIFTED}>
      {(lift) => <Button elevation={lift}>Publish</Button>}
    </Matrix>
  ),
  title: "Elevation",
};

export const square: Scene = {
  about:
    "A button holding one glyph fixes the square shape and requires an accessible name, because the glyph names nothing.",
  draw: () => (
    <Matrix direction="row" knob="size" of={SCALE}>
      {(size) => (
        <IconButton aria-label="Approve" size={size}>
          <Icon viewBox="0 0 24 24">
            <path d={CHECK} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </IconButton>
      )}
    </Matrix>
  ),
  title: "One glyph",
};

export const states: Scene = {
  about: "A disabled button keeps its box and stops taking a press.",
  draw: () => (
    <Matrix direction="row" knob="disabled" of={PRESSED}>
      {(disabled) => <Button disabled={disabled}>Publish</Button>}
    </Matrix>
  ),
  title: "States",
};

export default specimen({
  about: "The element a person presses, and the square that holds one glyph.",
  group: "Actions",
  id: "actions/button",
  scenes: [looks, sizes, statuses, elevation, square, states],
});
