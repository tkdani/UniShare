"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import useProfile from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

interface FeedCardProps {
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

export function FeedCard(props: FeedCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const profile = useProfile();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(props.like_count);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const check = async () => {
      const { data: likedData } = await supabase
        .from("file_likes")
        .select("id")
        .eq("user_id", profile.id)
        .eq("file_id", props.id)
        .maybeSingle();

      const { data: savedData } = await supabase
        .from("file_saves")
        .select("id")
        .eq("user_id", profile.id)
        .eq("file_id", props.id)
        .maybeSingle();

      setLiked(!!likedData);
      setSaved(!!savedData);
    };

    check();
  }, [profile, props.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) {
      router.push("/login");
      return;
    }
    if (profile.is_banned) return;

    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;
    setLiked(newLiked);
    setLikes(newLikes);

    if (newLiked) {
      await supabase
        .from("file_likes")
        .insert({ user_id: profile.id, file_id: props.id });
    } else {
      await supabase
        .from("file_likes")
        .delete()
        .eq("user_id", profile.id)
        .eq("file_id", props.id);
    }

    await supabase
      .from("user_files")
      .update({ like_count: newLikes })
      .eq("id", props.id);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) {
      router.push("/login");
      return;
    }
    if (!profile.is_banned) return;

    const newSaved = !saved;
    setSaved(newSaved);

    if (newSaved) {
      await supabase
        .from("file_saves")
        .insert({ user_id: profile.id, file_id: props.id });
    } else {
      await supabase
        .from("file_saves")
        .delete()
        .eq("user_id", profile.id)
        .eq("file_id", props.id);
    }
  };

  return (
    <div
      className="group cursor-pointer rounded-xl border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
      onClick={() =>
        router.push(`/notes?file=${encodeURIComponent(props.url)}`)
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7">
            <AvatarImage src={props.signedAvatarUrl || undefined} />
            <AvatarFallback className="text-xs">
              {props.owner?.username?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/profile/${props.owner?.username}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-medium text-foreground hover:text-primary hover:underline"
          >
            {props.owner?.username || "Unknown"}
          </Link>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatTimeAgo(props.created_at)}
        </span>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-foreground group-hover:text-primary">
            {props.file_name}
          </h2>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {props.course}
            {props.lesson && (
              <span className="text-muted-foreground/60">
                {" · "}
                {props.lesson}
              </span>
            )}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={`shrink-0 ${getTypeColor(props.type)}`}
        >
          {props.type}
        </Badge>
      </div>

      <p className="mt-1 truncate text-xs text-muted-foreground/70">
        {props.university}
      </p>

      <div className="mt-3 flex items-center gap-1 border-t pt-3">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-muted",
            liked ? "text-red-500" : "text-muted-foreground",
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
          {likes}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/notes?file=${encodeURIComponent(props.url)}`);
          }}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {props.commentCount}
        </button>

        <button
          onClick={handleSave}
          className={cn(
            "ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-muted",
            saved ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
