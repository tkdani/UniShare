import { render, screen, fireEvent } from "@testing-library/react";
import CollapsibleFileTree from "@/components/CollapsibleFileTree";
import { describe, it, expect, vi } from "vitest";

describe("CollapsibleFileTree", () => {
  it("reveals file after expanding folders", () => {
    const files = [
      {
        university: "Eotvos Lorand Tudományegyetem",
        course: "Math",
        lesson: "1",
        file_name: "file1.pdf",
      },
    ] as any;

    render(<CollapsibleFileTree files={files} onSetSelectedFile={vi.fn()} />);

    fireEvent.click(screen.getByText("ELTE"));
    fireEvent.click(screen.getByText("Math"));
    fireEvent.click(screen.getByText("1"));

    expect(screen.getByText("file1.pdf")).toBeInTheDocument();
  });
});
