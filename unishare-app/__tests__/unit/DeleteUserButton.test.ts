import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { deleteUser } from "@/lib/deleteUser";
import React from "react";

vi.mock("@/lib/deleteUser");
vi.mock("lucide-react", () => ({
  Trash2: () => React.createElement("svg", null),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DeleteUserButton", () => {
  it("renders nothing when user is admin", () => {
    const { container } = render(
      React.createElement(DeleteUserButton, {
        userId: "1",
        username: "adminuser",
        isAdmin: true,
      }),
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows delete button initially", () => {
    render(
      React.createElement(DeleteUserButton, {
        userId: "1",
        username: "testuser",
        isAdmin: false,
      }),
    );
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("shows confirmation dialog after clicking delete", () => {
    render(
      React.createElement(DeleteUserButton, {
        userId: "1",
        username: "testuser",
        isAdmin: false,
      }),
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("hides confirmation dialog after clicking No", () => {
    render(
      React.createElement(DeleteUserButton, {
        userId: "1",
        username: "testuser",
        isAdmin: false,
      }),
    );
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("No"));
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.queryByText("Yes")).not.toBeInTheDocument();
  });

  it("calls deleteUser with correct userId on confirm", async () => {
    vi.mocked(deleteUser).mockResolvedValue({ error: "" });
    render(
      React.createElement(DeleteUserButton, {
        userId: "abc-123",
        username: "testuser",
        isAdmin: false,
      }),
    );
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith("abc-123");
    });
  });

  it("shows loading state while deleting", async () => {
    vi.mocked(deleteUser).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ error: "" }), 100)),
    );
    render(
      React.createElement(DeleteUserButton, {
        userId: "1",
        username: "testuser",
        isAdmin: false,
      }),
    );
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));
    expect(screen.getByText("...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });
  });

  it("shows alert on error", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(deleteUser).mockResolvedValue({ error: "Valami hiba" });
    render(
      React.createElement(DeleteUserButton, {
        userId: "1",
        username: "testuser",
        isAdmin: false,
      }),
    );
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Hiba: Valami hiba");
    });
    alertMock.mockRestore();
  });
});
