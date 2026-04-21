import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotesToShow from "@/components/NotesToShow";
import { createClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/components/UserProvider", () => ({
  useUser: () => ({ id: "user-1" }),
}));

vi.mock("@/components/MediaViewer", () => ({
  MediaViewer: (props: any) => (
    <div data-testid="media-viewer">{props.fileName}</div>
  ),
}));

describe("NotesToShow integration", () => {
  it("renders MediaViewer with signed file url", async () => {
    const mockFile = {
      id: "1",
      file_name: "test.pdf",
      url: "file-url",
      created_at: "2024-01-01",
      like_count: 5,
      owner_id: "owner-1",
      university: "ELTE",
      course: "Math",
      lesson: null,
    };

    const createSignedUrl = vi.fn().mockResolvedValue({
      data: { signedUrl: "signed-file-url" },
    });

    const supabaseMock = {
      storage: {
        from: vi.fn(() => ({
          createSignedUrl,
        })),
      },
      from: vi.fn((table: string) => {
        if (table === "profiles") {
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: { avatar_url: null },
                  }),
              }),
            }),
          };
        }

        if (table === "comments") {
          return {
            select: () => ({
              eq: () =>
                Promise.resolve({
                  data: [],
                }),
            }),
          };
        }

        if (table === "blocked_users") {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  maybeSingle: () => Promise.resolve({ data: null }),
                }),
              }),
            }),
          };
        }

        if (table === "file_likes" || table === "file_saves") {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  maybeSingle: () => Promise.resolve({ data: null }),
                }),
              }),
            }),
          };
        }

        return {};
      }),
    };

    vi.mocked(createClient).mockReturnValue(supabaseMock as any);

    render(<NotesToShow file={mockFile} />);

    await waitFor(() => {
      expect(screen.getByTestId("media-viewer")).toBeInTheDocument();
    });

    const viewer = screen.getByTestId("media-viewer");
    expect(viewer).toHaveTextContent("test.pdf");
    expect(createSignedUrl).toHaveBeenCalled();
  });
});
