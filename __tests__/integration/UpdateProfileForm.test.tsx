import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UpdateProfileForm from "@/components/UpdateProfileForm";

const mockUpsert = vi.fn();
const mockMaybeSingle = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: mockMaybeSingle,
    upsert: mockUpsert,
  }),
}));

const mockUser = {
  id: "123",
  email: "test@example.com",
  username: "danitakacs",
  full_name: "Takacs Daniel",
  avatar_url: null,
};

describe("UpdateProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display the user's current data", () => {
    render(<UpdateProfileForm user={mockUser as any} />);

    expect(screen.getByLabelText(/Email/i)).toBeDisabled();
    expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe(
      mockUser.email,
    );
    expect((screen.getByLabelText(/Username/i) as HTMLInputElement).value).toBe(
      mockUser.username,
    );
  });

  it("should show validation error if username is too short", async () => {
    render(<UpdateProfileForm user={mockUser as any} />);

    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: "ab" } });

    await waitFor(() => {
      expect(
        screen.getByText(/Username must be at least 3 characters/i),
      ).toBeDefined();
    });
  });

  it("should show error if username is already taken", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { id: "other-id" },
      error: null,
    });

    render(<UpdateProfileForm user={mockUser as any} />);

    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: "taken-name" } });

    await waitFor(() => {
      expect(screen.getByText(/This username is already taken/i)).toBeDefined();
    });
  });

  it("should call upsert and show success message on valid submit", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    mockUpsert.mockResolvedValue({ error: null });

    render(<UpdateProfileForm user={mockUser as any} />);

    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
      expect(screen.getByText(/Profile updated successfully!/i)).toBeDefined();
    });
  });
});
