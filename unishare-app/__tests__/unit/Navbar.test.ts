import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NavBar from "@/components/NavBar";
import React from "react";

vi.mock("@/components/AvatarDropdown", () => ({
  default: () => React.createElement("div", null, "AvatarDropdown"),
}));
vi.mock("@/components/DarkModeSwitch", () => ({
  default: () => React.createElement("div", null, "DarkModeSwitch"),
}));
vi.mock("@/components/SearchBar", () => ({
  SearchBar: () => React.createElement("div", null, "SearchBar"),
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href }, children),
}));

describe("NavBar", () => {
  it("renders all navigation links", () => {
    render(React.createElement(NavBar));
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("home link points to correct route", () => {
    render(React.createElement(NavBar));
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  });

  it("statistics link points to correct route", () => {
    render(React.createElement(NavBar));
    expect(screen.getByText("Statistics").closest("a")).toHaveAttribute(
      "href",
      "/statistics",
    );
  });

  it("saved link points to correct route", () => {
    render(React.createElement(NavBar));
    expect(screen.getByText("Saved").closest("a")).toHaveAttribute(
      "href",
      "/saved",
    );
  });

  it("notes link points to correct route", () => {
    render(React.createElement(NavBar));
    expect(screen.getByText("Notes").closest("a")).toHaveAttribute(
      "href",
      "/notes",
    );
  });

  it("renders SearchBar", () => {
    render(React.createElement(NavBar));
    expect(screen.getByText("SearchBar")).toBeInTheDocument();
  });

  it("renders DarkModeSwitch", () => {
    render(React.createElement(NavBar));
    expect(screen.getByText("DarkModeSwitch")).toBeInTheDocument();
  });

  it("renders AvatarDropdown", () => {
    render(React.createElement(NavBar));
    expect(screen.getByText("AvatarDropdown")).toBeInTheDocument();
  });
});
