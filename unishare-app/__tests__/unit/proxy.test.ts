import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/proxy";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

function createRequest(pathname: string) {
  return new NextRequest(new URL(`http://localhost${pathname}`));
}

describe("updateSession middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login if user is not authenticated on protected route", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(),
    } as any);

    const request = createRequest("/saved");
    const response = await updateSession(request);

    expect(response.status).toBe(307);

    const location = response.headers.get("location")!;
    const url = new URL(location);

    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("next")).toBe("/saved");
  });

  it("allows access to public routes without user", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(),
    } as any);

    const request = createRequest("/login");
    const response = await updateSession(request);

    expect(response.status).toBe(200);
  });

  it("redirects logged in user away from login page", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "123" } },
        }),
      },
      from: vi.fn(),
    } as any);

    const request = createRequest("/login");
    const response = await updateSession(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("redirects non-admin user from /admin to /", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-123" } },
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
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("allows admin user to access /admin", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "admin-123" } },
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
