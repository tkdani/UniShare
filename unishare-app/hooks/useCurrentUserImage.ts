"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useCurrentUserImage() {
  const supabase = createClient();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user?.id)
        .single();

      if (profileError || !profile?.avatar_url) {
        return;
      }

      const { data, error } = await supabase.storage
        .from("avatars")
        .createSignedUrl(profile.avatar_url, 3600);

      console.log(data?.signedUrl);
      setImage(data?.signedUrl ?? null);
    };
    fetchUserImage();
  }, []);

  return image;
}
