import { StatsCards } from "@/components/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { RecentFiles } from "@/components/RecentFiles";
import { TopUsers } from "@/components/TopUsers";

async function getStats() {
  const supabase = await createClient();

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

  const { data: topCommentedFile } = await supabase
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
    .limit(100);
  const mostCommentedFile =
    topCommentedFile?.sort((a, b) => {
      const aCount =
        (a.comments as unknown as { count: number }[])[0]?.count ?? 0;
      const bCount =
        (b.comments as unknown as { count: number }[])[0]?.count ?? 0;
      return bCount - aCount;
    })[0] ?? null;

  const { data: topLiker } = await supabase
    .from("file_likes")
    .select(
      `
      user_id,
      user:profiles!user_id(username, avatar_url, full_name)
    `,
    )
    .limit(1000);

  const { data: topSaver } = await supabase
    .from("file_saves")
    .select(
      `
      user_id,
      user:profiles!user_id(username, avatar_url, full_name)
    `,
    )
    .limit(1000);

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
    const user = like.user as unknown as {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
    };
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
    const user = save.user as unknown as {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
    };
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
      url,
      owner:profiles!owner_id(username, avatar_url)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(6);

  return (recentFiles || []) as unknown as {
    id: string;
    file_name: string;
    university: string;
    course: string;
    type: string;
    lesson: string | null;
    like_count: number;
    created_at: string;
    url: string;
    owner: { username: string; avatar_url: string | null };
  }[];
}

async function getTopUsers() {
  const supabase = await createClient();

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
    const owner = file.owner as unknown as {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
    };
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

  const topUploadersWithAvatars = await Promise.all(
    topUploaders.map(async (user) => {
      if (!user.avatar_url) return { ...user, signedAvatarUrl: null };

      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(user.avatar_url, 3600);

      return { ...user, signedAvatarUrl: data?.signedUrl ?? null };
    }),
  );

  return topUploadersWithAvatars;
}

export default async function StatsPage() {
  const [stats, recentFiles, topUsers] = await Promise.all([
    getStats(),
    getRecentFiles(),
    getTopUsers(),
  ]);
  return (
    <div>
      <div className="text-3xl font-bold tracking-tight text-foreground pb-2">
        Statistics
      </div>
      <StatsCards stats={stats} />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentFiles files={recentFiles} />
        </div>

        <div className="lg:col-span-1">
          <TopUsers users={topUsers} />
        </div>
      </div>
    </div>
  );
}
