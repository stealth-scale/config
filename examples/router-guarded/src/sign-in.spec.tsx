import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SignIn } from "#sign-in.tsx";

describe("SignIn", () => {
  it("asks a person to sign in", () => {
    render(<SignIn />);

    expect(screen.getByRole("article").textContent).toBe("Sign in to read this.");
  });
});
