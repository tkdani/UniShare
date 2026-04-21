import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { deleteUser } from "@/lib/deleteUser";

vi.mock("@/lib/supabase/server");
vi.mock("@supabase/supabase-js");
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("deleteUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthorized if no user", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as any);

    const result = await deleteUser("123");

    expect(result).toEqual({ error: "Unauthorized" });
  });

  it("returns unauthorized if not admin", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { is_admin: false },
            }),
          }),
        }),
      }),
    } as any);

    const result = await deleteUser("123");

    expect(result).toEqual({ error: "Unauthorized" });
  });

  it("deletes user successfully", async () => {
    const deleteMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const adminClientMock = {
      from: vi.fn().mockReturnValue({
        delete: deleteMock,
      }),
      auth: {
        admin: {
          deleteUser: vi.fn().mockResolvedValue({ error: null }),
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "admin-1" } },
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { is_admin: true },
            }),
          }),
        }),
      }),
    } as any);

    vi.mocked(createAdminClient).mockReturnValue(adminClientMock as any);

    const result = await deleteUser("123");

    expect(result).toEqual({ success: true });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
  });

  it("returns error if profile delete fails", async () => {
    const adminClientMock = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: "DB error" },
          }),
        }),
      }),
      auth: {
        admin: {
          deleteUser: vi.fn(),
        },
      },
    };

    vi.mocked(createAdminClient).mockReturnValue(adminClientMock as any);

    const result = await deleteUser("123");

    expect(result).toEqual({ error: "DB error" });
  });

  it("returns error if auth delete fails", async () => {
    const adminClientMock = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
      auth: {
        admin: {
          deleteUser: vi.fn().mockResolvedValue({
            error: { message: "Auth error" },
          }),
        },
      },
    };

    vi.mocked(createAdminClient).mockReturnValue(adminClientMock as any);

    const result = await deleteUser("123");

    expect(result).toEqual({ error: "Auth error" });
  });
});
