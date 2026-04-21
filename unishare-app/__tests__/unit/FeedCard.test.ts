import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/client";
import { FeedCard } from "@/components/FeedCard";
import { useUser } from "@/components/UserProvider";
import React from "react";

vi.mock("@/lib/supabase/client");
vi.mock("@/components/UserProvider", () => ({ useUser: vi.fn() }));
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href }, children),
}));
vi.mock("lucide-react", () => ({
  Heart: () => React.createElement("svg", { "data-testid": "heart" }),
  MessageCircle: () => React.createElement("svg", null),
  Bookmark: () => React.createElement("svg", { "data-testid": "bookmark" }),
  Clock: () => React.createElement("svg", null),
}));
vi.mock("@/lib/utils", () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
  formatTimeAgo: () => "1h ago",
  getTypeColor: () => "bg-blue-100",
}));

const fromMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  pushMock.mockClear();
  vi.mocked(createClient).mockReturnValue({
    from: fromMock,
  } as any);
});

const defaultProps = {
  id: "file-1",
  url: "elte/math/notes.pdf",
  file_name: "Math Notes",
  university: "ELTE",
  course: "Math",
  type: "exam",
  lesson: null,
  like_count: 5,
  created_at: "2024-01-01",
  owner: { username: "testuser", avatar_url: null },
  signedAvatarUrl: null,
  commentCount: 3,
};

const mockSupabaseNoData = () => {
  fromMock.mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }),
    insert: vi.fn().mockResolvedValue({ error: null }),
    delete: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
  });
};

describe("FeedCard", () => {
  it("renders file name and course", () => {
    vi.mocked(useUser).mockReturnValue(null);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    expect(screen.getByText("Math Notes")).toBeInTheDocument();
    expect(screen.getByText("Math")).toBeInTheDocument();
  });

  it("renders university and owner username", () => {
    vi.mocked(useUser).mockReturnValue(null);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    expect(screen.getByText("ELTE")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("renders like count and comment count", () => {
    vi.mocked(useUser).mockReturnValue(null);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders lesson when provided", () => {
    vi.mocked(useUser).mockReturnValue(null);
    mockSupabaseNoData();
    const { container } = render(
      React.createElement(FeedCard, { ...defaultProps, lesson: "1" }),
    );
    expect(container.textContent).toContain("1");
  });

  it("shows Save button when not saved", () => {
    vi.mocked(useUser).mockReturnValue(null);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("redirects to login on like when not logged in", async () => {
    vi.mocked(useUser).mockReturnValue(null);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    fireEvent.click(screen.getByText("5"));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("increments like count when liked", async () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      is_banned: false,
    } as any);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    fireEvent.click(screen.getByText("5"));
    await waitFor(() => {
      expect(screen.getByText("6")).toBeInTheDocument();
    });
  });

  it("does not allow banned user to like", async () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      is_banned: true,
    } as any);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    fireEvent.click(screen.getByText("5"));
    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  it("shows Saved after clicking save", async () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      is_banned: false,
    } as any);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("does not allow banned user to save", async () => {
    vi.mocked(useUser).mockReturnValue({
      id: "user-1",
      is_banned: true,
    } as any);
    mockSupabaseNoData();
    render(React.createElement(FeedCard, defaultProps));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });
});
