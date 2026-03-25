import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/proxy";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getClaims: vi.fn().mockResolvedValue({ data: { claims: null } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }),
  })),
}));

function createRequest(pathname: string) {
  return new NextRequest(new URL(`http://localhost${pathname}`));
}

describe("updateSession middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login if user on restricted page ", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({ data: { claims: null } }),
      },
      from: vi.fn(),
    } as any);

    const request = createRequest("/saved");
    const response = await updateSession(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("allows access to login page without user", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({ data: { claims: null } }),
      },
      from: vi.fn(),
    } as any);

    const request = createRequest("/login");
    const response = await updateSession(request);

    expect(response.status).toBe(200);
  });

  it("redirects non-admin user from /admin to /", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "user-123" } },
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

    const request = createRequest("/admin");
    const response = await updateSession(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/");
  });

  it("allows admin user to access /admin", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "admin-123" } },
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

    const request = createRequest("/admin/users");
    const response = await updateSession(request);

    expect(response.status).toBe(200);
  });
});
