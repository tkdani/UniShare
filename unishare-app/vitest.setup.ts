import "@testing-library/jest-dom";

import { vi } from "vitest";

// Mock Next.js Navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock Supabase Client
const mockSignOut = vi.fn().mockResolvedValue({ error: null });
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}));

// Mock User Context Hook
vi.mock("./UserProvider", () => ({
  useUser: vi.fn(),
}));

export { mockSignOut };
