"user client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useProfile() {
  const supabase = createClient();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(data);
    };

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) await fetchProfile(user.id);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return profile;
}
