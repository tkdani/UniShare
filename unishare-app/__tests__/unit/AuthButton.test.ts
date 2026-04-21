import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthButton } from "@/components/AuthButton";
import { createClient } from "@/lib/supabase/server";
import React from "react";

vi.mock("@/lib/supabase/server");
vi.mock("@/components/LogoutButton", () => ({
  LogoutButton: () => React.createElement("button", null, "Logout"),
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href }, children),
}));

describe("AuthButton", () => {
  it("shows greeting and logout button when logged in", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { email: "test@example.com" } },
        }),
      },
    } as any);

    render(await AuthButton());

    expect(screen.getByText(/Hey, test@example.com!/)).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("shows sign in and sign up buttons when logged out", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: null },
        }),
      },
    } as any);

    render(await AuthButton());

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("sign in link points to correct route", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: null },
        }),
      },
    } as any);

    render(await AuthButton());

    expect(screen.getByText("Sign in").closest("a")).toHaveAttribute(
      "href",
      "/auth/login",
    );
  });
});
