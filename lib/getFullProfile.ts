import { createClient } from "./supabase/server";

export async function getFullProfile(username: string) {
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
