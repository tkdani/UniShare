import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/client";
import AvatarDropdown from "@/components/AvatarDropdown";
import React from "react";
import { useUser } from "@/components/UserProvider";

vi.mock("@/lib/supabase/client");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/components/UserProvider", () => ({
  useUser: vi.fn(),
}));
vi.mock("@/components/CurrentUserAvatar", () => ({
  default: () => React.createElement("div", null, "Avatar"),
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href }, children),
}));

const signOutMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createClient).mockReturnValue({
    auth: { signOut: signOutMock },
  } as any);
});

const openDropdown = () => {
  fireEvent.click(screen.getByRole("button"));
};

describe("AvatarDropdown", () => {
  it("shows login link when user is not logged in", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(AvatarDropdown));
    openDropdown();
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("shows username when user is logged in", () => {
    vi.mocked(useUser).mockReturnValue({
      username: "testuser",
      is_admin: false,
    } as any);
    render(React.createElement(AvatarDropdown));
    openDropdown();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("shows admin link when user is admin", () => {
    vi.mocked(useUser).mockReturnValue({
      username: "adminuser",
      is_admin: true,
    } as any);
    render(React.createElement(AvatarDropdown));
    openDropdown();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("does not show admin link when user is not admin", () => {
    vi.mocked(useUser).mockReturnValue({
      username: "testuser",
      is_admin: false,
    } as any);
    render(React.createElement(AvatarDropdown));
    openDropdown();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("calls signOut on logout click", async () => {
    signOutMock.mockResolvedValue({});
    vi.mocked(useUser).mockReturnValue({
      username: "testuser",
      is_admin: false,
    } as any);
    render(React.createElement(AvatarDropdown));
    openDropdown();
    fireEvent.click(screen.getByText("Log out"));
    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
    });
  });

  it("shows docs link for all users", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(AvatarDropdown));
    openDropdown();
    expect(screen.getByText("Docs").closest("a")).toHaveAttribute(
      "href",
      "/docs",
    );
  });
});
