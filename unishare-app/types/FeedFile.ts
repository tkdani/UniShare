type FeedFile = {
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
};
