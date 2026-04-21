import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/ContextMenu";
import { formatTimeAgo } from "@/lib/utils";

export function CommentItem({
  comment,
  currentUserId,
  onBlock,
  isBlockedUser,
}: {
  comment: CommentType;
  currentUserId?: string;
  onBlock?: (userId: string | undefined) => void;
  isBlockedUser: boolean;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex gap-3 px-4 py-3 cursor-pointer">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={comment.avatar} alt={comment.author} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {comment.author.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-sm text-card-foreground">
                <Link
                  href={`/profile/${comment.author}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                >
                  {comment.author}
                </Link>
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {comment.text}
            </p>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        {currentUserId && currentUserId !== comment.authorId ? (
          <ContextMenuItem
            variant="destructive"
            onClick={() => onBlock?.(comment.authorId!)}
          >
            {isBlockedUser ? "Unblock" : "Block"}
          </ContextMenuItem>
        ) : (
          <ContextMenuItem disabled>No action</ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
