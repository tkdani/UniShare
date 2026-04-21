import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/client";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import React from "react";

vi.mock("@/lib/supabase/client");
vi.mock("@/components/AvatarUpload", () => ({
  default: () => React.createElement("div", null, "AvatarUpload"),
}));

const maybeSingleMock = vi.fn();
const upsertMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createClient).mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: maybeSingleMock,
        }),
      }),
      upsert: upsertMock,
    }),
  } as any);
});

const defaultUser = {
  id: "user-1",
  email: "test@example.com",
  username: "testuser",
  full_name: "Test User",
  avatar_url: null,
} as any;

describe("UpdateProfileForm", () => {
  it("renders email field with correct value", () => {
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  it("renders username field with correct value", () => {
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
  });

  it("renders full name field with correct value", () => {
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
  });

  it("shows error when username is too short", async () => {
    maybeSingleMock.mockResolvedValue({ data: null });
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    const usernameInput = screen.getByDisplayValue("testuser");
    fireEvent.change(usernameInput, { target: { value: "ab" } });
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(
        screen.getByText("Username must be at least 3 characters"),
      ).toBeInTheDocument();
    });
  });

  it("shows error when username is already taken", async () => {
    maybeSingleMock.mockResolvedValue({ data: { id: "other-user" } });
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    const usernameInput = screen.getByDisplayValue("testuser");
    fireEvent.change(usernameInput, { target: { value: "takenuser" } });
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(
        screen.getByText("This username is already taken"),
      ).toBeInTheDocument();
    });
  });

  it("shows success message after successful update", async () => {
    maybeSingleMock.mockResolvedValue({ data: null });
    upsertMock.mockResolvedValue({ error: null });
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(
        screen.getByText("Profile updated successfully!"),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state while updating", async () => {
    maybeSingleMock.mockResolvedValue({ data: null });
    upsertMock.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    fireEvent.click(screen.getByText("Update"));
    expect(screen.getByText("Loading ...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Update")).toBeInTheDocument();
    });
  });

  it("shows error message when update fails", async () => {
    maybeSingleMock.mockResolvedValue({ data: null });
    upsertMock.mockResolvedValue({ error: { message: "DB error" } });
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(screen.getByText("Error updating profile")).toBeInTheDocument();
    });
  });

  it("renders sign out button", () => {
    render(React.createElement(UpdateProfileForm, { user: defaultUser }));
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });
});
