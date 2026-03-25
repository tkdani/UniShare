import { describe, it, expect } from "vitest";

describe("Supabase client env variables", () => {
  it("NEXT_PUBLIC_SUPABASE_URL is defined", () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  });

  it("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is defined", () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBeDefined();
  });
});
