import { ProfileStats } from "@/components/ProfileStats";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const user = await useUser();
  if (!user) redirect("/login");
  const { data: following } = await supabase
    .from("follows")
    .select("profiles!following_id(id, username, avatar_url)")
    .eq("follower_id", user.id);

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
        .eq("following_id", user.id),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id),
    ]);

  return (
    <div className="flex gap-10 items-center justify-center">
      <UpdateProfileForm user={user} />
      <ProfileStats
        userId={user.id}
        followerCount={followerCount ?? 0}
        followingCount={followingCount ?? 0}
        followingList={followingList}
      />
    </div>
  );
}
