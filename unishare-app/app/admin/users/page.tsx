import { BanUserButton } from "@/components/BanUserButton";
import { createClient } from "@/lib/supabase/server";

export default async function AdminUsers() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, username, is_admin, created_at, avatar_url, is_banned")
    .order("created_at", { ascending: false });
  if (error) console.log(error);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Felhasználók</h1>
      <div className="rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground border-b">
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Created at</th>
              <th className="text-left p-4">Role</th>
              <th className="text-right p-4">Operation</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="p-4">{user.username}</td>
                <td className="p-4 text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("hu")}
                </td>
                <td className="p-4">
                  {user.is_admin ? (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  ) : (
                    <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                      User
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <BanUserButton
                    userId={user.id}
                    isBanned={user.is_banned}
                    isAdmin={user.is_admin}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
