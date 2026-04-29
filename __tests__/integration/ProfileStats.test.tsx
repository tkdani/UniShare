import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProfileStats } from "@/components/ProfileStats";

vi.mock("@/lib/supabase/server", () => ({
  createClient: () =>
    Promise.resolve({
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }),
}));

vi.mock("lucide-react", () => ({
  Heart: () => null,
  MessageCircle: () => null,
  Bookmark: () => null,
  Upload: () => null,
  Car: () => null,
}));

vi.mock("@/components/UploadedFiles", () => ({
  default: () => null,
}));

describe("ProfileStats", () => {
  const testProps = {
    userId: "1",
    followerCount: 10,
    followingCount: 5,
    followingList: [],
    profile: {
      id: "1",
      username: "testuser",
      avatar_url: null,
    },
  };

  it("should display the correct follower count", async () => {
    const Result = await ProfileStats(testProps);
    render(Result);
    const countElement = screen.getByText("10");
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveClass("font-bold");
  });
});
