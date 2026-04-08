import { createClient } from "../supabase/server";

interface FeedFile {
  id: string;
  url: string;
  file_name: string;
  university: string;
  course: string;
  type: string;
  lesson: string | null;
  like_count: number;
  created_at: string;
  owner: { username: string; avatar_url: string | null };
  signedAvatarUrl: string | null;
  commentCount: number;
}

export async function useFeedFiles(max: number): Promise<FeedFile[]> {
  const supabase = await createClient();

  const { data: files } = await supabase
    .from("user_files")
    .select(
      `
      id,
      url,
      file_name,
      university,
      course,
      type,
      lesson,
      like_count,
      created_at,
      owner:profiles!owner_id(username, avatar_url),
      comments(count)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(max);

  if (!files) return [];

  const result = await Promise.all(
    (
      files as unknown as {
        id: string;
        url: string;
        file_name: string;
        university: string;
        course: string;
        type: string;
        lesson: string | null;
        like_count: number;
        created_at: string;
        owner: { username: string; avatar_url: string | null };
        comments: { count: number }[];
      }[]
    ).map(async (file) => {
      let signedAvatarUrl: string | null = null;
      if (file.owner?.avatar_url) {
        const { data } = await supabase.storage
          .from("avatars")
          .createSignedUrl(file.owner.avatar_url, 3600);
        signedAvatarUrl = data?.signedUrl ?? null;
      }

      const commentCount = file.comments?.[0]?.count ?? 0;

      return {
        ...file,
        signedAvatarUrl,
        commentCount,
      };
    }),
  );

  return result;
}
