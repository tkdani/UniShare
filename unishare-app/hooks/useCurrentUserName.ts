"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useCurrentUserName() {
  const [name, setName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfileName = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username,  full_name")
        .eq("id", user?.id)
        .single();

      if (profileError) {
        console.log(profileError);
        return;
      }

      setName(profile.full_name ?? profile.username);
    };

    fetchProfileName();
  }, []);

  return name || "?";
}
