"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function useDeleteUser(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!callerProfile?.is_admin) return { error: "Unauthorized" };

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error: profileError } = await adminClient
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) return { error: profileError.message };

  const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

  if (authError) return { error: authError.message };

  revalidatePath("/admin/users");
  return { success: true };
}
