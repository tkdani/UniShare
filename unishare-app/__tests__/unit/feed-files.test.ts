import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { getFeedFiles } from "@/lib/getFeedFiles";

vi.mock("@/lib/supabase/server");

describe("useFeedFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns mapped files with signed avatar and comment count", async () => {
    const mockFiles = [
      {
        id: "1",
        url: "file.pdf",
        file_name: "Test file",
        university: "ELTE",
        course: "Math",
        type: "exam",
        lesson: null,
        like_count: 5,
        created_at: "2024-01-01",
        owner: {
          username: "user1",
          avatar_url: "avatar.png",
        },
        comments: [{ count: 3 }],
      },
    ];

    const createSignedUrl = vi.fn().mockResolvedValue({
      data: { signedUrl: "signed-url" },
    });

    const storageFromMock = vi.fn(() => ({
      createSignedUrl,
    }));

    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: mockFiles }),
          }),
        }),
      }),
      storage: {
        from: storageFromMock,
      },
    } as any);

    const result = await getFeedFiles(10);

    expect(result).toHaveLength(1);
    expect(result[0].signedAvatarUrl).toBe("signed-url");
    expect(result[0].commentCount).toBe(3);
  });

  it("returns empty array if no files", async () => {
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: null }),
          }),
        }),
      }),
    } as any);

    const result = await getFeedFiles(10);

    expect(result).toEqual([]);
  });

  it("does not call storage if no avatar", async () => {
    const createSignedUrl = vi.fn();

    const mockFiles = [
      {
        id: "1",
        url: "file.pdf",
        file_name: "Test file",
        university: "ELTE",
        course: "Math",
        type: "exam",
        lesson: null,
        like_count: 5,
        created_at: "2024-01-01",
        owner: {
          username: "user1",
          avatar_url: null,
        },
        comments: [],
      },
    ];

    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: mockFiles }),
          }),
        }),
      }),
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl,
        }),
      },
    } as any);

    const result = await getFeedFiles(10);

    expect(createSignedUrl).not.toHaveBeenCalled();
    expect(result[0].signedAvatarUrl).toBeNull();
  });

  it("sets commentCount to 0 if no comments", async () => {
    const mockFiles = [
      {
        id: "1",
        url: "file.pdf",
        file_name: "Test file",
        university: "ELTE",
        course: "Math",
        type: "exam",
        lesson: null,
        like_count: 5,
        created_at: "2024-01-01",
        owner: {
          username: "user1",
          avatar_url: null,
        },
        comments: [],
      },
    ];

    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: mockFiles }),
          }),
        }),
      }),
    } as any);

    const result = await getFeedFiles(10);

    expect(result[0].commentCount).toBe(0);
  });
});
