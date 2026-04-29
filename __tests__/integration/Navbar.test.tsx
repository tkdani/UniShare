import { useUser } from "@/components/UserProvider";
import { mockSignOut } from "@/vitest.setup";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NavBar from "@/components/NavBar";

vi.mock("@/components/UserProvider", () => ({
  useUser: vi.fn(),
}));
const openUserMenu = () => {
  const buttons = screen.getAllByRole("button");
  const trigger = buttons.find((btn) => btn.className.includes("rounded-full"));

  if (!trigger) throw new Error("Could not find Avatar trigger button");

  fireEvent.click(trigger);
};

describe("NavBar Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show "Log in" option when user is unauthenticated', () => {
    vi.mocked(useUser).mockReturnValue(null);
    render(<NavBar />);

    openUserMenu();

    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.queryByText("Log out")).toBeNull();
  });

  it("should show Admin link only if user has admin privileges", () => {
    vi.mocked(useUser).mockReturnValue({
      username: "AdminUser",
      is_admin: true,
    } as any);

    render(<NavBar />);

    openUserMenu();

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it('should call sign out and refresh the page when "Log out" is clicked', async () => {
    vi.mocked(useUser).mockReturnValue({
      username: "user",
    } as any);

    render(<NavBar />);

    openUserMenu();

    const logoutBtn = screen.getByText("Log out");
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
  it("should display user-specific link when authenticated", async () => {
    const mockUser = { username: "danitakacs", is_admin: false };
    vi.mocked(useUser).mockReturnValue(mockUser as any);

    render(<NavBar />);

    const buttons = screen.getAllByRole("button");

    const avatarButton = buttons.find((btn) =>
      btn.className.includes("rounded-full"),
    );

    if (!avatarButton) throw new Error("Could not find Avatar trigger button");

    fireEvent.click(avatarButton);

    await waitFor(() => {
      expect(screen.getByText("danitakacs")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    expect(screen.queryByText("Admin")).toBeNull();
  });
});
