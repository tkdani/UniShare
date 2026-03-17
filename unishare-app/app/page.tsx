import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/StatsCard";
import { RecentFiles } from "@/components/RecentFiles";
import { TopUsers } from "@/components/TopUsers";
import NavBar from "@/components/NavBar";

async function getStats() {
  const supabase = await createClient();

  // Legtöbb like-ot kapó file
  const { data: topLikedFile } = await supabase
    .from("user_files")
    .select(
      `
      id,
      file_name,
      like_count,
      course,
      university,
      owner:profiles!owner_id(username, avatar_url)
    `,
    )
    .order("like_count", { ascending: false })
    .limit(1)
    .single();

  // Legtöbb kommentet kapó file
  const { data: mostCommentedFile } = await supabase
    .from("user_files")
    .select(
      `
      id,
      file_name,
      course,
      university,
      owner:profiles!owner_id(username, avatar_url),
      comments(count)
    `,
    )
    .order("comments(count)", { ascending: false })
    .limit(1)
    .single();

  // User aki a legtöbbet like-olt
  const { data: topLiker } = await supabase
    .from("file_likes")
    .select(
      `
      user_id,
      user:profiles!user_id(username, avatar_url, full_name)
    `,
    )
    .limit(1000);

  // User aki a legtöbbet mentett
  const { data: topSaver } = await supabase
    .from("file_saves")
    .select(
      `
      user_id,
      user:profiles!user_id(username, avatar_url, full_name)
    `,
    )
    .limit(1000);

  // Összesített statisztikák
  const { count: totalFiles } = await supabase
    .from("user_files")
    .select("*", { count: "exact", head: true });

  const { count: totalLikes } = await supabase
    .from("file_likes")
    .select("*", { count: "exact", head: true });

  const { count: totalComments } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true });

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Számoljuk ki a top liker-t és saver-t
  const likerCounts = new Map<
    string,
    {
      count: number;
      user: {
        username: string;
        avatar_url: string | null;
        full_name: string | null;
      };
    }
  >();
  topLiker?.forEach((like) => {
    const existing = likerCounts.get(like.user_id);
    const userArray = like.user as unknown as {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
    }[];
    const user = userArray?.[0];
    if (existing) {
      existing.count++;
    } else if (user) {
      likerCounts.set(like.user_id, { count: 1, user });
    }
  });

  const saverCounts = new Map<
    string,
    {
      count: number;
      user: {
        username: string;
        avatar_url: string | null;
        full_name: string | null;
      };
    }
  >();
  topSaver?.forEach((save) => {
    const existing = saverCounts.get(save.user_id);
    const userArray = save.user as unknown as {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
    }[];
    const user = userArray?.[0];
    if (existing) {
      existing.count++;
    } else if (user) {
      saverCounts.set(save.user_id, { count: 1, user });
    }
  });

  const topLikerUser = Array.from(likerCounts.entries()).sort(
    (a, b) => b[1].count - a[1].count,
  )[0];

  const topSaverUser = Array.from(saverCounts.entries()).sort(
    (a, b) => b[1].count - a[1].count,
  )[0];

  return {
    topLikedFile,
    mostCommentedFile,
    topLikerUser: topLikerUser
      ? { ...topLikerUser[1].user, likeCount: topLikerUser[1].count }
      : null,
    topSaverUser: topSaverUser
      ? { ...topSaverUser[1].user, saveCount: topSaverUser[1].count }
      : null,
    totals: {
      files: totalFiles || 0,
      likes: totalLikes || 0,
      comments: totalComments || 0,
      users: totalUsers || 0,
    },
  };
}

async function getRecentFiles() {
  const supabase = await createClient();

  const { data: recentFiles } = await supabase
    .from("user_files")
    .select(
      `
      id,
      file_name,
      university,
      course,
      type,
      lesson,
      like_count,
      created_at,
      owner:profiles!owner_id(username, avatar_url)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(6);

  return recentFiles || [];
}

async function getTopUsers() {
  const supabase = await createClient();

  // Top feltöltők (legtöbb file-t feltöltő userek)
  const { data: files } = await supabase
    .from("user_files")
    .select(
      `
      owner_id,
      owner:profiles!owner_id(username, avatar_url, full_name)
    `,
    )
    .limit(500);

  const uploaderCounts = new Map<
    string,
    {
      count: number;
      user: {
        username: string;
        avatar_url: string | null;
        full_name: string | null;
      };
    }
  >();
  files?.forEach((file) => {
    const existing = uploaderCounts.get(file.owner_id);
    const ownerArray = file.owner as unknown as {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
    }[];
    const owner = ownerArray?.[0];
    if (existing) {
      existing.count++;
    } else if (owner) {
      uploaderCounts.set(file.owner_id, {
        count: 1,
        user: owner,
      });
    }
  });

  const topUploaders = Array.from(uploaderCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([id, data]) => ({ id, ...data.user, uploadCount: data.count }));

  return topUploaders;
}

export default async function HomePage() {
  const [stats, recentFiles, topUsers] = await Promise.all([
    getStats(),
    getRecentFiles(),
    getTopUsers(),
  ]);

  return (
    <main className="min-h-screen bg-background p-4">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            UniShare
          </h1>
          <p className="mt-2 text-muted-foreground">
            UniShare is a platform built for university students to share and
            discover learning materials. Upload your notes, assignments, and
            study files and explore what others have shared across courses and
            universities. Like the content you find helpful, save it for later,
            and join the conversation with comments.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Recent Files - 2 columns */}
          <div className="lg:col-span-2">
            <RecentFiles files={recentFiles} />
          </div>

          {/* Top Users Sidebar */}
          <div className="lg:col-span-1">
            <TopUsers users={topUsers} />
          </div>
        </div>
      </div>
    </main>
  );
}
