import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { ProfileStats } from "@/components/ProfileStats";
import React from "react";

vi.mock("@/lib/supabase/server");
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href }, children),
}));
vi.mock("lucide-react", () => ({
  Heart: () => React.createElement("svg", null),
  MessageCircle: () => React.createElement("svg", null),
  Bookmark: () => React.createElement("svg", null),
  Upload: () => React.createElement("svg", null),
  Car: () => React.createElement("svg", null),
  FileText: () => React.createElement("svg", null),
  EllipsisVertical: () => React.createElement("svg", null),
}));

const mockSupabase = (counts: {
  uc?: number;
  lc?: number;
  cc?: number;
  sc?: number;
}) => {
  const makeQuery = (count: number) => ({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ count }),
    }),
  });
  vi.mocked(createClient).mockResolvedValue({
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "user_files") return makeQuery(counts.uc ?? 0);
      if (table === "file_likes") return makeQuery(counts.lc ?? 0);
      if (table === "comments") return makeQuery(counts.cc ?? 0);
      if (table === "file_saves") return makeQuery(counts.sc ?? 0);
      return makeQuery(0);
    }),
  } as any);
};

const defaultProps = {
  userId: "user-1",
  followerCount: 10,
  followingCount: 5,
  followingList: [],
  profile: {
    id: "1",
    username: "testuser",
    avatar_url: null,
    stats: {
      uploads: 0,
    },
    uploadedFiles: [],
  },
};

describe("ProfileStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders upload count", async () => {
    mockSupabase({ uc: 3 });
    render(await ProfileStats(defaultProps));
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Uploads")).toBeInTheDocument();
  });

  it("renders singular label when count is 1", async () => {
    mockSupabase({ uc: 1 });
    render(await ProfileStats(defaultProps));
    expect(screen.getByText("Upload")).toBeInTheDocument();
  });

  it("renders like count", async () => {
    mockSupabase({ lc: 7 });
    render(await ProfileStats(defaultProps));
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
  });

  it("renders comment count", async () => {
    mockSupabase({ cc: 4 });
    render(await ProfileStats(defaultProps));
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
  });

  it("renders save count", async () => {
    mockSupabase({ sc: 2 });
    render(await ProfileStats(defaultProps));
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Saves")).toBeInTheDocument();
  });

  it("renders follower and following counts", async () => {
    mockSupabase({});
    render(await ProfileStats(defaultProps));
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    const followingLabels = screen.getAllByText("Following");
    expect(followingLabels.length).toBeGreaterThan(0);
  });

  it("renders following list with correct links", async () => {
    mockSupabase({});
    render(
      await ProfileStats({
        ...defaultProps,
        followingList: [
          { id: "1", username: "alice", avatar_url: null },
          { id: "2", username: "bob", avatar_url: null },
        ],
      }),
    );
    expect(screen.getByText("@alice")).toBeInTheDocument();
    expect(screen.getByText("@alice").closest("a")).toHaveAttribute(
      "href",
      "/profile/alice",
    );
    expect(screen.getByText("@bob")).toBeInTheDocument();
  });

  it("renders zeros when counts are null", async () => {
    mockSupabase({ uc: 0, lc: 0, cc: 0, sc: 0 });
    render(await ProfileStats(defaultProps));
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(4);
  });

  it("does not render following list when empty", async () => {
    mockSupabase({});
    render(await ProfileStats(defaultProps));
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });
});
