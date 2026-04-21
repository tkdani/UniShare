import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/client";
import { BanUserButton } from "@/components/BanUserButton";
import React from "react";

vi.mock("@/lib/supabase/client");

const updateMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createClient).mockReturnValue({
    from: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: updateMock,
      }),
    }),
  } as any);
});

describe("BanUserButton", () => {
  it("shows dash when user is admin", () => {
    render(
      React.createElement(BanUserButton, {
        userId: "1",
        isAdmin: true,
        isBanned: false,
      }),
    );
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("shows Block button when user is not banned", () => {
    render(
      React.createElement(BanUserButton, {
        userId: "1",
        isAdmin: false,
        isBanned: false,
      }),
    );
    expect(screen.getByText("Block")).toBeInTheDocument();
  });

  it("shows Unblock button when user is banned", () => {
    render(
      React.createElement(BanUserButton, {
        userId: "1",
        isAdmin: false,
        isBanned: true,
      }),
    );
    expect(screen.getByText("Unblock")).toBeInTheDocument();
  });

  it("toggles to Unblock after clicking Block", async () => {
    updateMock.mockResolvedValue({ error: null });
    render(
      React.createElement(BanUserButton, {
        userId: "1",
        isAdmin: false,
        isBanned: false,
      }),
    );
    fireEvent.click(screen.getByText("Block"));
    await waitFor(() => {
      expect(screen.getByText("Unblock")).toBeInTheDocument();
    });
  });

  it("toggles to Block after clicking Unblock", async () => {
    updateMock.mockResolvedValue({ error: null });
    render(
      React.createElement(BanUserButton, {
        userId: "1",
        isAdmin: false,
        isBanned: true,
      }),
    );
    fireEvent.click(screen.getByText("Unblock"));
    await waitFor(() => {
      expect(screen.getByText("Block")).toBeInTheDocument();
    });
  });

  it("shows loading state while updating", async () => {
    updateMock.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );
    render(
      React.createElement(BanUserButton, {
        userId: "1",
        isAdmin: false,
        isBanned: false,
      }),
    );
    fireEvent.click(screen.getByText("Block"));
    expect(screen.getByText("...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Unblock")).toBeInTheDocument();
    });
  });

  it("calls supabase update with correct userId", async () => {
    updateMock.mockResolvedValue({ error: null });
    render(
      React.createElement(BanUserButton, {
        userId: "abc-123",
        isAdmin: false,
        isBanned: false,
      }),
    );
    fireEvent.click(screen.getByText("Block"));
    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith("id", "abc-123");
    });
  });
});
