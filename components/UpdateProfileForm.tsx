"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AvatarUpload from "./AvatarUpload";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Button } from "./ui/Button";

export default function UpdateProfileForm({ user }: { user: User }) {
  const supabase = createClient();
  const [fullname, setFullname] = useState<string | null>(
    user.full_name ?? null,
  );
  const [username, setUsername] = useState<string | null>(
    user.username ?? null,
  );
  const [avatar_url, setAvatarUrl] = useState<string | null>(
    user.avatar_url ?? null,
  );
  const [loading, setLoading] = useState(false); // nem kell true, nincs initial fetch
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    avatar_url: string | null;
  }) {
    setUsernameError(null);
    setSuccess(false);

    if (!username || username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    if (username !== user.username) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (existing) {
        setUsernameError("This username is already taken");
        return;
      }
    }

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
      setSuccess(true);
    } catch (error) {
      setUsernameError("Error updating profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!username || username === user.username) {
      setUsernameError(null);
      return;
    }
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    const checkUsername = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (data) {
        setUsernameError("This username is already taken");
      } else {
        setUsernameError(null);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

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
            avatar_url={avatar_url}
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
                className={usernameError ? "border-red-500" : ""}
              />
              {usernameError && (
                <p className="mt-1 text-xs text-red-500">{usernameError}</p>
              )}
            </div>

            {success && (
              <p className="text-xs text-green-500">
                Profile updated successfully!
              </p>
            )}

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
