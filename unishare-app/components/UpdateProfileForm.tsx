"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type User } from "@supabase/supabase-js";
import AvatarUpload from "./AvatarUpload";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Button } from "./ui/Button";
import useProfile from "@/hooks/useProfile";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  username: string;
  avatar_url?: string;
  is_admin?: boolean;
  is_banned?: boolean;
}

export default function AccountForm({ user }: { user: Profile }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const profile = useProfile();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget flex flex-col gap-5 w-max">
      <Card>
        <CardHeader className="flex items-center justify-center">
          <AvatarUpload
            uid={user?.id ?? null}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ fullname, username, avatar_url: url });
            }}
          />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="text" value={user?.email} disabled />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullname || ""}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <div>
                <Button
                  className="button primary block"
                  onClick={() =>
                    updateProfile({ fullname, username, avatar_url })
                  }
                  disabled={loading}
                >
                  {loading ? "Loading ..." : "Update"}
                </Button>
              </div>

              <div>
                <form action="/auth/signout" method="post">
                  <Button
                    className="button block"
                    type="submit"
                    variant={"destructive"}
                  >
                    Sign out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
