import { ProfileStats } from "@/components/ProfileStats";
import AccountForm from "@/components/UpdateProfileForm";
import { getProfile } from "@/lib/getProfile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const { data: following } = await supabase
    .from("follows")
    .select("profiles!following_id(id, username, avatar_url)")
    .eq("follower_id", profile.id);

  const followingList = (following ?? []).map(
    (f) =>
      f.profiles as unknown as {
        id: string;
        username: string;
        avatar_url: string | null;
      },
  );

  const [{ count: followerCount }, { count: followingCount }] =
    await Promise.all([
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profile.id),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profile.id),
    ]);

  return (
    <div className="flex gap-10 items-center justify-center">
      <AccountForm user={profile} />
      <ProfileStats
        userId={profile.id}
        followerCount={followerCount ?? 0}
        followingCount={followingCount ?? 0}
        followingList={followingList}
      />
    </div>
  );
}
