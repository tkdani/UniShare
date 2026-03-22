import { createClient } from "@/lib/supabase/server";
import { Heart, MessageCircle, Bookmark, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export async function ProfileStats({ userId }: { userId: string }) {
  const supabase = await createClient();

  const [
    { count: uploadCount },
    { count: likeCount },
    { count: commentCount },
    { count: saveCount },
  ] = await Promise.all([
    supabase
      .from("user_files")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId),
    supabase
      .from("file_likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("file_saves")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const stats = [
    {
      label: "Upload",
      value: uploadCount || 0,
      icon: Upload,
      color: "text-primary",
    },
    {
      label: "Like",
      value: likeCount || 0,
      icon: Heart,
      color: "text-red-500",
    },
    {
      label: "Comment",
      value: commentCount || 0,
      icon: MessageCircle,
      color: "text-blue-500",
    },
    {
      label: "Save",
      value: saveCount || 0,
      icon: Bookmark,
      color: "text-yellow-500",
    },
  ];

  return (
    <Card className="w-max">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-lg bg-muted/50 p-3"
            >
              <Icon className={`mb-1 h-5 w-5 ${color}`} />
              <span className="text-2xl font-bold">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
