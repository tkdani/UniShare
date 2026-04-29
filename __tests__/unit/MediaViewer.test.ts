import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/client";
import { MediaViewer } from "@/components/MediaViewer";
import { useUser } from "@/components/UserProvider";
import React from "react";

global.fetch = vi.fn().mockResolvedValue({
  text: vi.fn().mockResolvedValue("const x = 1;\nconsole.log(x);"),
  ok: true,
  body: null,
});

vi.mock("@/lib/supabase/client");
vi.mock("@/components/UserProvider", () => ({ useUser: vi.fn() }));
vi.mock("@/components/CommentItem", () => ({
  CommentItem: ({ comment }: { comment: { text: string } }) =>
    React.createElement("div", null, comment.text),
}));
vi.mock("@/components/AiSummaryContent", () => ({
  AiSummaryContent: ({
    summary,
    isLoading,
  }: {
    summary: string;
    isLoading: boolean;
  }) => React.createElement("div", null, isLoading ? "Loading..." : summary),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href }, children),
}));
vi.mock("lucide-react", () => ({
  Heart: () => React.createElement("svg", null),
  Bookmark: () => React.createElement("svg", null),
  MessageCircle: () => React.createElement("svg", null),
  Send: () => React.createElement("svg", null),
  FileCode: () => React.createElement("svg", null),
  FileText: () => React.createElement("svg", null),
  Image: () => React.createElement("svg", null),
  Copy: () => React.createElement("svg", null),
  Check: () => React.createElement("svg", null),
  Sparkles: () => React.createElement("svg", null),
  Download: () => React.createElement("svg", null),
  Clock: () => React.createElement("svg", null),
  EllipsisVertical: () => React.createElement("svg", null),
}));
vi.mock("@/lib/utils", () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

const pushMock = vi.fn();
const fromMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn().mockResolvedValue({
    text: vi.fn().mockResolvedValue("const x = 1;"),
    ok: true,
    body: null,
  });
  vi.mocked(createClient).mockReturnValue({
    from: fromMock,
  } as any);
  fromMock.mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      }),
    }),
    insert: vi.fn().mockResolvedValue({ error: null }),
    delete: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
  });
});

const defaultProps = {
  src: "https://example.com/file.pdf",
  type: "pdf" as const,
  fileName: "test.pdf",
  upload_date: "2024-01-01",
  owner: { id: "owner-1", username: "owneruser" } as any,
  avatarUrl: null,
  fileId: "file-1",
  initialLikes: 5,
  initialLiked: false,
  initialSaved: false,
  initialComments: [],
};

describe("MediaViewer", () => {
  it("renders file name", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(MediaViewer, defaultProps));
    expect(screen.getAllByText("test.pdf").length).toBeGreaterThan(0);
  });

  it("renders owner username", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(MediaViewer, defaultProps));
    expect(screen.getByText("owneruser")).toBeInTheDocument();
  });

  it("renders initial like count", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(MediaViewer, defaultProps));
    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
  });

  it("redirects to login on like when not logged in", async () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(MediaViewer, defaultProps));

    const likeButton = screen.getAllByText("5")[0].closest("button");

    fireEvent.click(likeButton!);

    await waitFor(
      () => {
        expect(pushMock).toHaveBeenCalledWith("/login");
      },
      { timeout: 2000 },
    );
  });

  it("increments like count when logged in user clicks like", async () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      is_banned: false,
    } as any);

    const onLikeChange = vi.fn();

    render(React.createElement(MediaViewer, { ...defaultProps, onLikeChange }));

    const likeButton = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("5"));

    if (!likeButton) throw new Error("Like button not found");

    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(onLikeChange).toHaveBeenCalledWith(true, 6);
    });
  });

  it("shows Save button when not saved", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(MediaViewer, defaultProps));
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("shows Saved after clicking save when logged in", async () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      is_banned: false,
    } as any);
    const onSaveChange = vi.fn();
    render(React.createElement(MediaViewer, { ...defaultProps, onSaveChange }));
    await waitFor(() => {
      expect(onSaveChange).not.toHaveBeenCalled();
    });
    const saveButton = screen.getByText("Save").closest("button");
    fireEvent.click(saveButton!);
    await waitFor(() => {
      expect(onSaveChange).toHaveBeenCalledWith(true);
    });
  });

  it("shows comments tab by default", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(MediaViewer, defaultProps));
    expect(screen.getByText(/Comments/)).toBeInTheDocument();
  });

  it("shows no comments message when empty", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(MediaViewer, defaultProps));
    expect(screen.getByText("No comments yet")).toBeInTheDocument();
  });

  it("renders existing comments", () => {
    vi.mocked(useUser).mockReturnValue(null);
    const comments = [
      { id: "1", text: "Great note!", author: "user1", createdAt: new Date() },
    ];
    render(
      React.createElement(MediaViewer, {
        ...defaultProps,
        initialComments: comments as any,
      }),
    );
    expect(screen.getAllByText("Great note!")[0]).toBeInTheDocument();
  });

  it("adds comment on button click", async () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      username: "testuser",
      is_banned: false,
    } as any);
    render(React.createElement(MediaViewer, defaultProps));

    const inputs = screen.getAllByPlaceholderText("Add a comment...");

    await act(async () => {
      fireEvent.change(inputs[0], { target: { value: "New comment" } });
    });

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText("Add a comment...");
      expect(inputs[0]).toHaveValue("New comment");
    });

    fireEvent.keyDown(inputs[0], { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(inputs[0]).toHaveValue("");
    });
  });

  it("shows blocked message when isBlocked is true", () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      is_banned: false,
    } as any);
    render(
      React.createElement(MediaViewer, { ...defaultProps, isBlocked: true }),
    );
    expect(
      screen.getByText("You are blocked by the user."),
    ).toBeInTheDocument();
  });

  it("shows AI Summary tab only for code type", async () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      is_banned: false,
    } as any);
    await act(async () => {
      render(
        React.createElement(MediaViewer, {
          ...defaultProps,
          type: "code",
          src: "https://example.com/file.ts",
        }),
      );
    });
    expect(screen.getByText(/AI Summary/)).toBeInTheDocument();
  });

  it("does not show AI Summary tab for pdf type", () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(React.createElement(MediaViewer, defaultProps));
    expect(screen.queryByText(/AI Summary/)).not.toBeInTheDocument();
  });
});
