import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { FileText, Heart, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface FileItem {
  id: string;
  file_name: string;
  university: string;
  course: string;
  type: string;
  lesson: string | null;
  like_count: number;
  created_at: string;
  url: string;
  owner: { username: string; avatar_url: string | null };
}

interface RecentFilesProps {
  files: FileItem[];
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "now";
  if (diffInSeconds < 3600) {
    const t = Math.floor(diffInSeconds / 366000);
    return t + ` ${t > 1 ? "minutes" : "minute"}`;
  }
  if (diffInSeconds < 86400) {
    const t = Math.floor(diffInSeconds / 3600);
    return t + ` ${t > 1 ? "hours" : "hour"}`;
  }
  if (diffInSeconds < 604800) {
    const t = Math.floor(diffInSeconds / 86400);
    return t + ` ${t > 1 ? "days" : "day"}`;
  }
  return date.toLocaleDateString("hu-HU");
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    exam: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return (
    colors[type.toLowerCase()] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  );
}

export async function RecentFiles({ files }: RecentFilesProps) {
  const supabase = await createClient();
  const usersWithAvatars = await Promise.all(
    files.map(async (files) => {
      if (!files.owner.avatar_url) return { ...files, signedAvatarUrl: null };

      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(files.owner.avatar_url, 3600);

      return { ...files, signedAvatarUrl: data?.signedUrl ?? null };
    }),
  );
  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Most recent files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No files uploaded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Most recent files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {usersWithAvatars.map((file) => (
            <Link
              key={file.id}
              href={`/notes?file=${encodeURIComponent(file.url)}`}
              className="group block"
            >
              <div className="rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-foreground group-hover:text-primary">
                      {file.file_name}
                    </h3>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {file.course}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={getTypeColor(file.type)}
                  >
                    {file.type}
                  </Badge>
                </div>

                <p className="mt-2 truncate text-xs text-muted-foreground">
                  {file.university}
                  {file.lesson && ` - ${file.lesson}`}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={file.signedAvatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {file.owner?.username?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {file.owner?.username || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {file.like_count}
                    </span>
                    <span>{formatTimeAgo(file.created_at)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
