import { ProfileStats } from "@/components/ProfileStats";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/getProfile";
import AccountForm from "@/components/UpdateProfileForm";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen p-4">
      <AccountForm user={profile} />
      <ProfileStats userId={profile.id} />
    </div>
  );
}
