import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/fetchUser";
import ProfilePage from "@/app/(app)/profile/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    const error = new Error("NEXT_REDIRECT");
    (error as any).digest = `NEXT_REDIRECT;replace;${url};303;`;
    throw error;
  }),
}));
vi.mock("@/lib/fetchUser", () => ({
  fetchUser: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  }),
}));

describe("ProfilePage Server Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to login if no user is found", async () => {
    vi.mocked(fetchUser).mockResolvedValue(null);

    const callProfilePage = () => ProfilePage();

    await expect(callProfilePage()).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
