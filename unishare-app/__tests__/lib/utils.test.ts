import { createClient } from "@/lib/supabase/server";
import {
  cn,
  convertShortname,
  formatTimeAgo,
  getProfile,
  getTypeColor,
} from "@/lib/utils";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("getProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null if no user is logged in", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as any);

    const result = await getProfile();
    expect(result).toBeNull();
  });

  it("returns profile if user is logged in", async () => {
    const mockProfile = {
      id: "123",
      username: "testuser",
      email: "test@test.com",
    };

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "123" } } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProfile }),
          }),
        }),
      }),
    } as any);

    const result = await getProfile();
    expect(result).toEqual(mockProfile);
  });
});

describe("formatTimeAgo", () => {
  it("returns 'just now' for current time", () => {
    expect(formatTimeAgo(new Date().toISOString())).toBe("just now");
  });

  it("returns minutes ago", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe("5m ago");
  });

  it("returns hours ago", () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe("3h ago");
  });

  it("returns days ago", () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe("2d ago");
  });

  it("returns formatted date for older dates", () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toMatch(/\d+\/\d+\/\d+/);
  });
});

describe("getTypeColor", () => {
  it("Returns blue for class type ", () => {
    expect(getTypeColor("class")).toBe(
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    );
  });
  it("Returns red for exam type ", () => {
    expect(getTypeColor("exam")).toBe(
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    );
  });
  it("Returns muted for unknown type ", () => {
    expect(getTypeColor("unknown")).toBe("bg-muted text-muted-foreground");
  });
});

describe("convertShortname", () => {
  it("Convert the university full name to short name ", () => {
    expect(convertShortname("Eotvos Lorand Tudomany Egyetem")).toBe("ELTE");
  });
});

describe("cn", () => {
  it("merges multiple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("merges tailwind classes correctly - last one wins", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });
});
