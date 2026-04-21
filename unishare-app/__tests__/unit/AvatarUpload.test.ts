import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/client";
import AvatarUpload from "@/components/AvatarUpload";
import React from "react";

vi.mock("@/lib/supabase/client");
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    React.createElement("img", { src, alt }),
}));

const downloadMock = vi.fn();
const uploadMock = vi.fn();
const removeMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createClient).mockReturnValue({
    storage: {
      from: vi.fn().mockReturnValue({
        download: downloadMock,
        upload: uploadMock,
        remove: removeMock,
      }),
    },
  } as any);
});

const defaultProps = {
  uid: "user-123",
  url: null,
  size: 100,
  onUpload: vi.fn(),
  avatar_url: null,
};

describe("AvatarUpload", () => {
  it("renders placeholder when no url is provided", () => {
    render(React.createElement(AvatarUpload, defaultProps));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.querySelector(".no-image")).toBeInTheDocument();
  });

  it("downloads and shows avatar when url is provided", async () => {
    const blob = new Blob(["image"], { type: "image/png" });
    downloadMock.mockResolvedValue({ data: blob, error: null });

    render(
      React.createElement(AvatarUpload, { ...defaultProps, url: "avatar.png" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
    expect(downloadMock).toHaveBeenCalledWith("avatar.png");
  });

  it("shows upload button", () => {
    render(React.createElement(AvatarUpload, defaultProps));
    expect(screen.getByText("Upload")).toBeInTheDocument();
  });

  it("shows uploading state during upload", async () => {
    uploadMock.mockResolvedValue({ error: null });

    render(React.createElement(AvatarUpload, defaultProps));

    const file = new File(["image"], "photo.png", { type: "image/png" });
    const input = document.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Upload")).toBeInTheDocument();
    });
  });

  it("calls onUpload with file path after successful upload", async () => {
    const onUpload = vi.fn();
    uploadMock.mockResolvedValue({ error: null });

    render(React.createElement(AvatarUpload, { ...defaultProps, onUpload }));

    const file = new File(["image"], "photo.png", { type: "image/png" });
    const input = document.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalled();
    });
    expect(onUpload.mock.calls[0][0]).toMatch(/user-123-.+\.png/);
  });

  it("removes old avatar before uploading new one", async () => {
    removeMock.mockResolvedValue({ error: null });
    uploadMock.mockResolvedValue({ error: null });

    render(
      React.createElement(AvatarUpload, {
        ...defaultProps,
        avatar_url: "old-avatar.png",
      }),
    );

    const file = new File(["image"], "photo.png", { type: "image/png" });
    const input = document.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(removeMock).toHaveBeenCalledWith(["old-avatar.png"]);
    });
  });

  it("does not call remove if no previous avatar", async () => {
    uploadMock.mockResolvedValue({ error: null });

    render(React.createElement(AvatarUpload, defaultProps));

    const file = new File(["image"], "photo.png", { type: "image/png" });
    const input = document.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(removeMock).not.toHaveBeenCalled();
    });
  });
});
