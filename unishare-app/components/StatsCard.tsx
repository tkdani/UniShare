import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  FileText,
  Heart,
  MessageSquare,
  Users,
  Trophy,
  Bookmark,
} from "lucide-react";

interface StatsProps {
  stats: {
    topLikedFile: {
      id: string;
      file_name: string;
      like_count: number;
      course: string;
      university: string;
      owner: { username: string; avatar_url: string | null }[];
    } | null;
    mostCommentedFile: {
      id: string;
      file_name: string;
      course: string;
      university: string;
      owner: { username: string; avatar_url: string | null }[];
      comments: { count: number }[];
    } | null;
    topLikerUser: {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
      likeCount: number;
    } | null;
    topSaverUser: {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
      saveCount: number;
    } | null;
    totals: {
      files: number;
      likes: number;
      comments: number;
      users: number;
    };
  };
}

export function StatsCards({ stats }: StatsProps) {
  return (
    <div className="space-y-6">
      {/* Összesített statisztikák */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Osszes File</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totals.files}</div>
            <p className="text-xs text-muted-foreground">feltoltott anyag</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Osszes Like</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totals.likes}</div>
            <p className="text-xs text-muted-foreground">kedveles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Osszes Komment
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totals.comments}</div>
            <p className="text-xs text-muted-foreground">hozzaszolas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Felhasznalok</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totals.users}</div>
            <p className="text-xs text-muted-foreground">regisztralt tag</p>
          </CardContent>
        </Card>
      </div>

      {/* Kiemelt statisztikák */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Legtöbb like-ot kapó file */}
        {stats.topLikedFile && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-600" />
                <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  Legnepszerubb File
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="truncate font-semibold text-foreground">
                {stats.topLikedFile.file_name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {stats.topLikedFile.course}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                <span className="text-sm font-medium">
                  {stats.topLikedFile.like_count} like
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legtöbb kommentet kapó file */}
        {stats.mostCommentedFile && (
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400">
                  Legtobb Komment
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="truncate font-semibold text-foreground">
                {stats.mostCommentedFile.file_name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {stats.mostCommentedFile.course}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-blue-500" />
                <span className="text-sm font-medium">
                  {stats.mostCommentedFile.comments?.[0]?.count || 0} komment
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legtöbbet like-oló user */}
        {stats.topLikerUser && (
          <Card className="border-pink-200 bg-pink-50/50 dark:border-pink-900 dark:bg-pink-950/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-600" />
                <CardTitle className="text-sm font-medium text-pink-800 dark:text-pink-400">
                  Top Likeolo
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={stats.topLikerUser.avatar_url || undefined}
                  />
                  <AvatarFallback>
                    {stats.topLikerUser.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {stats.topLikerUser.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.topLikerUser.likeCount} like adott
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legtöbbet mentő user */}
        {stats.topSaverUser && (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-green-600" />
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-400">
                  Top Gyujto
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={stats.topSaverUser.avatar_url || undefined}
                  />
                  <AvatarFallback>
                    {stats.topSaverUser.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {stats.topSaverUser.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.topSaverUser.saveCount} mentes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
