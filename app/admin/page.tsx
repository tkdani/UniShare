import { fetchUser } from "@/lib/fetchUser";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const profile = await fetchUser();
  if (!profile?.is_admin || !profile) redirect("/");
  const supabase = await createClient();

  const [{ count: userCount }, { count: fileCount }, { count: commentCount }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("user_files").select("*", { count: "exact", head: true }),
      supabase.from("comments").select("*", { count: "exact", head: true }),
    ]);

  const { data: topFiles } = await supabase
    .from("user_files")
    .select("file_name, like_count, university, course")
    .order("like_count", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8 min-w-80">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Users", value: userCount, icon: "👥" },
          { label: "Updated Files", value: fileCount, icon: "📁" },
          { label: "Comments", value: commentCount, icon: "💬" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-6">
            <p className="text-3xl mb-1">{stat.icon}</p>
            <p className="text-2xl font-bold">{stat.value ?? 0}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Most liked files</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground border-b">
              <th className="text-left pb-2">File</th>
              <th className="text-left pb-2">University</th>
              <th className="text-left pb-2">Course</th>
              <th className="text-right pb-2">Likes</th>
            </tr>
          </thead>
          <tbody>
            {topFiles?.map((f, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2">{f.file_name}</td>
                <td className="py-2 text-muted-foreground">{f.university}</td>
                <td className="py-2 text-muted-foreground">{f.course}</td>
                <td className="py-2 text-right">{f.like_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
