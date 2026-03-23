type User = {
  id: string;
  updated_at: string;
  created_at: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  follower_count: number;
  is_banned: boolean;
  is_admin: boolean;
  email: string;
};
