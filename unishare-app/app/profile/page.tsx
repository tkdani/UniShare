import NavBar from "@/components/NavBar";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function ProfileContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <UpdateProfileForm user={user} />;
}

export default async function Profile() {
  return (
    <div className="min-h-screen p-4">
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
