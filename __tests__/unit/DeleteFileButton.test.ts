import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/client";
import { DeleteFileButton } from "@/components/DeleteFileButton";
import React from "react";

vi.mock("@/lib/supabase/client");

const removeMock = vi.fn();
const deleteMock = vi.fn();
const selectMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createClient).mockReturnValue({
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "user_files") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: selectMock,
            }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: deleteMock,
          }),
        };
      }
    }),
    storage: {
      from: vi.fn().mockReturnValue({
        remove: removeMock,
      }),
    },
  } as any);
});

describe("DeleteFileButton", () => {
  it("shows Delete button initially", () => {
    render(React.createElement(DeleteFileButton, { fileId: "1" }));
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("shows confirmation after clicking Delete", () => {
    render(React.createElement(DeleteFileButton, { fileId: "1" }));
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("hides confirmation after clicking No", () => {
    render(React.createElement(DeleteFileButton, { fileId: "1" }));
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("No"));
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("shows Deleted after successful delete", async () => {
    selectMock.mockResolvedValue({
      data: { url: "files/test.pdf" },
    });
    deleteMock.mockResolvedValue({ error: null });
    removeMock.mockResolvedValue({});

    render(React.createElement(DeleteFileButton, { fileId: "1" }));
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(screen.getByText("Deleted")).toBeInTheDocument();
    });
  });

  it("shows loading state while deleting", async () => {
    selectMock.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { url: "files/test.pdf" } }), 100),
        ),
    );
    deleteMock.mockResolvedValue({ error: null });
    removeMock.mockResolvedValue({});

    render(React.createElement(DeleteFileButton, { fileId: "1" }));
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));

    expect(screen.getByText("...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Deleted")).toBeInTheDocument();
    });
  });

  it("removes file from storage after delete", async () => {
    selectMock.mockResolvedValue({
      data: { url: "something/files/university/math/test.pdf" },
    });
    deleteMock.mockResolvedValue({ error: null });
    removeMock.mockResolvedValue({});

    render(React.createElement(DeleteFileButton, { fileId: "1" }));
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(removeMock).toHaveBeenCalledWith(["university/math/test.pdf"]);
    });
  });

  it("does not show Deleted if delete returns error", async () => {
    selectMock.mockResolvedValue({ data: { url: "files/test.pdf" } });
    deleteMock.mockResolvedValue({ error: { message: "Delete failed" } });

    render(React.createElement(DeleteFileButton, { fileId: "1" }));
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(screen.queryByText("Deleted")).not.toBeInTheDocument();
    });
  });
});
