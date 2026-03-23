import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBarClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  FileText,
  Heart,
  MessageCircle,
  Bookmark,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { FollowButton } from "@/components/FollowButton";

async function getProfile(username: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, follower_count")
    .eq("username", username)
    .single();

  if (!profile) return null;

  let signedAvatarUrl: string | null = null;
  if (profile.avatar_url) {
    const { data } = await supabase.storage
      .from("avatars")
      .createSignedUrl(profile.avatar_url, 3600);
    signedAvatarUrl = data?.signedUrl ?? null;
  }

  const { data: uploadedFiles } = await supabase
    .from("user_files")
    .select(
      "id, file_name, course, university, type, like_count, created_at, url",
    )
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false });

  const { count: likeCount } = await supabase
    .from("file_likes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const { count: commentCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const { count: saveCount } = await supabase
    .from("file_saves")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  return {
    ...profile,
    signedAvatarUrl,
    uploadedFiles: uploadedFiles || [],
    stats: {
      uploads: uploadedFiles?.length || 0,
      likes: likeCount || 0,
      comments: commentCount || 0,
      saves: saveCount || 0,
    },
  };
}

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
  ] = await Promise.all([getProfile(username), supabase.auth.getUser()]);

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Files ({profile.stats.uploads})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.uploadedFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  Haven't uploaded any files.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {profile.uploadedFiles.map((file) => (
                  <Link
                    key={file.id}
                    href={`/notes?file=${encodeURIComponent(file.url)}`}
                    className="group block rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-foreground group-hover:text-primary">
                          {file.file_name}
                        </h3>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {file.course}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {file.university}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                          {file.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" />
                          {file.like_count}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
