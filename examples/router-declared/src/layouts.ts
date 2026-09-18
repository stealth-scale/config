/**
 * Names the frames a declaration may ask for.
 */

import { type FunctionComponent } from "react";

import { type LayoutProps } from "@stealthscale/provider-router";

import { Sales } from "#sales.tsx";

/**
 * The frames a declaration may name.
 *
 * @remarks
 *   A declaration names a layout by string, and this application decides what that string draws.
 *   Naming one this record has none of stops the compilation rather than drawing the page bare.
 */
export const LAYOUTS: Readonly<Record<string, FunctionComponent<LayoutProps>>> = { sales: Sales };
