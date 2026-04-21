import { useUser } from "@/components/UserProvider";
import { mockSignOut } from "@/vitest.setup";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NavBar from "@/components/NavBar";

vi.mock("@/components/UserProvider", () => ({
  useUser: vi.fn(),
}));

describe("NavBar Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show "Log in" option when user is unauthenticated', () => {
    vi.mocked(useUser).mockReturnValue(null);

    render(<NavBar />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    expect(screen.getByText("Log in")).toBeDefined();
    expect(screen.queryByText("Log out")).toBeNull();
  });

  it("should show Admin link only if user has admin privileges", () => {
    vi.mocked(useUser).mockReturnValue({
      username: "AdminUser",
      is_admin: true,
    } as any);

    render(<NavBar />);

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Admin")).toBeDefined();
  });
  it('should call sign out and refresh the page when "Log out" is clicked', async () => {
    vi.mocked(useUser).mockReturnValue({
      username: "user",
    } as any);

    render(<NavBar />);

    fireEvent.click(screen.getByRole("button"));
    const logoutBtn = screen.getByText("Log out");
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
  it("should display user-specific link when authenticated", () => {
    const mockUser = { username: "danitakacs", is_admin: false };
    (useUser as any).mockReturnValue(mockUser);

    render(<NavBar />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("danitakacs")).toBeDefined();
    expect(screen.getByText("Profile")).toBeDefined();
    expect(screen.queryByText("Admin")).toBeNull();
  });
});
