import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Crown, Upload } from "lucide-react";

interface TopUser {
  id: string;
  username: string;
  signedAvatarUrl: string | null;
  full_name: string | null;
  uploadCount: number;
}

interface TopUsersProps {
  users: TopUser[];
}

export function TopUsers({ users }: TopUsersProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Top uploaders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              No uploaders yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Top uploaders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  index === 0
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    : index === 1
                      ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      : index === 2
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={user.signedAvatarUrl || undefined} />
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground group-hover:text-primary">
                  {user.username}
                </p>
                {user.full_name && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.full_name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                <span className="font-medium">{user.uploadCount}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
