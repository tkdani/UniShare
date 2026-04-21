import { renderHook, act } from "@testing-library/react";
import { it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUpload } from "@/lib/hooks/useSupabaseUpload";

vi.mock("@/lib/supabase/client");
const uploadMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(createClient).mockReturnValue({
    storage: {
      from: vi.fn().mockReturnValue({
        upload: uploadMock,
      }),
    },
  } as any);
});

it("adds files on drop", () => {
  const { result } = renderHook(() =>
    useSupabaseUpload({ bucketName: "test" }),
  );

  const file = new File(["hello"], "test.txt", { type: "text/plain" });

  act(() => {
    result.current.onDrop([file], []);
  });

  expect(result.current.files).toHaveLength(1);
  expect(result.current.files[0].name).toBe("test.txt");
});

it("does not add duplicate files", () => {
  const { result } = renderHook(() =>
    useSupabaseUpload({ bucketName: "test" }),
  );

  const file = new File(["hello"], "test.txt");

  act(() => {
    result.current.onDrop([file], []);
    result.current.onDrop([file], []);
  });

  expect(result.current.files).toHaveLength(1);
});

it("uploads files successfully", async () => {
  uploadMock.mockResolvedValue({ error: null });

  const { result } = renderHook(() =>
    useSupabaseUpload({ bucketName: "test" }),
  );

  const file = new File(["hello"], "test.txt");

  act(() => {
    result.current.onDrop([file], []);
  });

  await act(async () => {
    await result.current.onUpload();
  });

  expect(result.current.successes).toContain("test.txt");
  expect(result.current.errors).toHaveLength(0);
});

it("handles upload errors", async () => {
  uploadMock.mockResolvedValue({
    error: { message: "Upload failed" },
  });

  const { result } = renderHook(() =>
    useSupabaseUpload({ bucketName: "test" }),
  );

  const file = new File(["hello"], "test.txt");

  act(() => {
    result.current.onDrop([file], []);
  });

  await act(async () => {
    await result.current.onUpload();
  });

  expect(result.current.errors[0].message).toBe("Upload failed");
});

it("retries only failed files", async () => {
  uploadMock
    .mockResolvedValueOnce({ error: { message: "fail" } })
    .mockResolvedValueOnce({ error: null });

  const { result } = renderHook(() =>
    useSupabaseUpload({ bucketName: "test" }),
  );

  const file = new File(["hello"], "test.txt");

  act(() => {
    result.current.onDrop([file], []);
  });

  await act(async () => {
    await result.current.onUpload();
  });

  expect(result.current.errors.length).toBe(1);

  await act(async () => {
    await result.current.onUpload();
  });

  expect(result.current.successes).toContain("test.txt");
});

it("sets isSuccess correctly", async () => {
  uploadMock.mockResolvedValue({ error: null });

  const { result } = renderHook(() =>
    useSupabaseUpload({ bucketName: "test" }),
  );

  const file = new File(["hello"], "test.txt");

  act(() => {
    result.current.onDrop([file], []);
  });

  await act(async () => {
    await result.current.onUpload();
  });

  expect(result.current.isSuccess).toBe(true);
});
