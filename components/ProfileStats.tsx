import { createClient } from "@/lib/supabase/server";
import { Heart, MessageCircle, Bookmark, Upload, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import Link from "next/link";
import { Separator } from "./ui/Separator";
import UploadedFiles from "./UploadedFiles";

const moreThanOne = (num: number) => {
  return num > 1;
};

export async function ProfileStats({
  userId,
  followerCount,
  followingCount,
  followingList,
  profile,
}: {
  userId: string;
  followerCount: number;
  followingCount: number;
  followingList: { id: string; username: string; avatar_url: string | null }[];
  profile: any;
}) {
  const supabase = await createClient();

  const [{ count: uc }, { count: lc }, { count: cc }, { count: sc }] =
    await Promise.all([
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
  const uploadCount = uc ?? 0;
  const likeCount = lc ?? 0;
  const commentCount = cc ?? 0;
  const saveCount = sc ?? 0;

  const stats = [
    {
      label: moreThanOne(uploadCount) ? "Uploads" : "Upload",
      value: uploadCount || 0,
      icon: Upload,
      color: "text-primary",
    },
    {
      label: moreThanOne(likeCount) ? "Likes" : "Like",
      value: likeCount || 0,
      icon: Heart,
      color: "text-red-500",
    },
    {
      label: moreThanOne(commentCount) ? "Comments" : "Comment",
      value: commentCount || 0,
      icon: MessageCircle,
      color: "text-blue-500",
    },
    {
      label: moreThanOne(saveCount) ? "Saves" : "Save",
      value: saveCount || 0,
      icon: Bookmark,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="flex flex-col gap-5 items-center w-max">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Activity stats */}
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Following
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-center">
          <div>
            {/* Followers / Following */}
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{followerCount}</span>
                <span className="text-xs text-muted-foreground">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{followingCount}</span>
                <span className="text-xs text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            {followingList.length > 0 && (
              <div className="flex flex-col gap-2">
                {followingList.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                  >
                    <span className="text-sm text-foreground">
                      @{user.username}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <UploadedFiles profile={profile} />
    </div>
  );
}
