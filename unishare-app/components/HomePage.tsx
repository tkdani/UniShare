import { createClient } from "@/lib/supabase/server";
import { Heart, MessageCircle, Bookmark, Clock, BookOpen } from "lucide-react";
import { FeedCard } from "./FeedCard";

interface FeedFile {
  id: string;
  url: string;
  file_name: string;
  university: string;
  course: string;
  type: string;
  lesson: string | null;
  like_count: number;
  created_at: string;
  owner: { username: string; avatar_url: string | null };
  signedAvatarUrl: string | null;
  commentCount: number;
}

function formatTimeAgo(dateString: string): string {
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

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    class: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    exam: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return colors[type.toLowerCase()] ?? "bg-muted text-muted-foreground";
}

async function getFeedFiles(): Promise<FeedFile[]> {
  const supabase = await createClient();

  const { data: files } = await supabase
    .from("user_files")
    .select(
      `
      id,
      url,
      file_name,
      university,
      course,
      type,
      lesson,
      like_count,
      created_at,
      owner:profiles!owner_id(username, avatar_url),
      comments(count)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (!files) return [];

  const result = await Promise.all(
    (
      files as unknown as {
        id: string;
        url: string;
        file_name: string;
        university: string;
        course: string;
        type: string;
        lesson: string | null;
        like_count: number;
        created_at: string;
        owner: { username: string; avatar_url: string | null };
        comments: { count: number }[];
      }[]
    ).map(async (file) => {
      let signedAvatarUrl: string | null = null;
      if (file.owner?.avatar_url) {
        const { data } = await supabase.storage
          .from("avatars")
          .createSignedUrl(file.owner.avatar_url, 3600);
        signedAvatarUrl = data?.signedUrl ?? null;
      }

      const commentCount = file.comments?.[0]?.count ?? 0;

      return {
        ...file,
        signedAvatarUrl,
        commentCount,
      };
    }),
  );

  return result;
}

export default async function HomePageComp() {
  const files = await getFeedFiles();

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none text-foreground">
            For You
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Latest notes</p>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No files uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <FeedCard key={file.id} {...file} />
          ))}
        </div>
      )}
    </div>
  );
}
