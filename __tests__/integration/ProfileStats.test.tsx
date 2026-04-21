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

describe("ProfileStats", () => {
  const defaultProps = {
    userId: "1",
    followerCount: 10,
    followingCount: 5,
    followingList: [{ id: "2", username: "friend", avatar_url: null }],
  };

  it("should display the correct follower count", async () => {
    const testProps = {
      userId: "1",
      followerCount: 10,
      followingCount: 5,
      followingList: [],
    };

    const Result = await ProfileStats(testProps);
    render(Result);

    const countElement = screen.getByText((content, node) => {
      const hasText = (node: Element) => node.textContent === "10";
      const nodeHasText = hasText(node as Element);
      const childrenDontHaveText = Array.from(node?.children || []).every(
        (child) => !hasText(child as Element),
      );
      return nodeHasText && childrenDontHaveText;
    });

    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveClass("font-bold");
  });
});
