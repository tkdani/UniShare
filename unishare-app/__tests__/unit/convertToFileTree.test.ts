import { describe, it, expect } from "vitest";
import { convertToFileTree } from "@/components/CollapsibleFileTree";

describe("convertToFileTree", () => {
  it("groups files into tree structure", () => {
    const files = [
      {
        university: "Eotvos Lorand Tudományegyetem",
        course: "Math",
        lesson: "1",
        file_name: "file1.pdf",
      },
      {
        university: "Eotvos Lorand Tudományegyetem",
        course: "Math",
        lesson: "1",
        file_name: "file2.pdf",
      },
    ] as any;

    const result = convertToFileTree(files);

    expect(result[0].name).toBe("ELTE");
    expect(result[0]).toHaveProperty("items");
  });

  it("creates file leaf nodes with path", () => {
    const files = [
      {
        university: "Eotvos Lorand Tudományegyetem",
        course: "Math",
        lesson: "1",
        file_name: "file1.pdf",
      },
    ] as any;

    const result = convertToFileTree(files);

    const leaf = (result[0] as any).items[0].items[0].items[0];

    expect(result).toEqual([
      {
        name: "ELTE",
        items: [
          {
            name: "Math",
            items: [
              {
                name: "1",
                items: [
                  {
                    name: "file1.pdf",
                    path: expect.any(String),
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });
});
