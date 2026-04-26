import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent } from "@/components/ui/Card";
import { Heart, MessageCircle, Bookmark, Upload, Users } from "lucide-react";
import { FollowButton } from "@/components/FollowButton";
import UploadedFiles from "@/components/UploadedFiles";
import { getFullProfile } from "@/lib/getFullProfile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const [
    profile,
    {
      data: { user: currentUser },
    },
  ] = await Promise.all([getFullProfile(username), supabase.auth.getUser()]);

  if (!profile) notFound();

  let isFollowing = false;
  if (currentUser && currentUser.id !== profile.id) {
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("following_id", profile.id)
      .maybeSingle();
    isFollowing = !!data;
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.signedAvatarUrl || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profile.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {profile.full_name || profile.username}
                    </h1>
                    <p className="text-muted-foreground">@{profile.username}</p>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-medium text-foreground">
                        {profile.follower_count ?? 0}
                      </span>
                      followers
                    </div>
                  </div>
                </div>
              </div>
              <FollowButton
                targetUserId={profile.id}
                currentUserId={currentUser?.id ?? null}
                initialFollowing={isFollowing}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                <Upload className="mb-1 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {profile.stats.uploads}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile.stats.uploads > 1 ? "uploads" : "upload"}
                </span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                <Heart className="mb-1 h-5 w-5 text-red-500" />
                <span className="text-2xl font-bold">
                  {profile.stats.likes}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile.stats.uploads > 1 ? "likes" : "like"}
                </span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                <MessageCircle className="mb-1 h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">
                  {profile.stats.comments}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile.stats.uploads > 1 ? "comments" : "comment"}
                </span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                <Bookmark className="mb-1 h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">
                  {profile.stats.saves}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile.stats.uploads > 1 ? "saves" : "save"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <UploadedFiles profile={profile} />
      </div>
    </main>
  );
}
