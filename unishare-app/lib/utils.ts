import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "./supabase/client";

export function convertShortname(name: string) {
  return name
    .split(" ")
    .map((word) => {
      if (word.toLowerCase().includes("tudományegyetem")) {
        return "TE";
      }
      return word[0];
    })
    .join("")
    .toUpperCase();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US");
}

export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    class: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    exam: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return colors[type.toLowerCase()] ?? "bg-muted text-muted-foreground";
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
