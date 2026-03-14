"use client";

import * as React from "react";
import {
  Heart,
  Bookmark,
  MessageCircle,
  Send,
  FileCode,
  FileText,
  Image as ImageIcon,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import useProfile from "@/hooks/useProfile";

const languageColors: Record<string, string> = {
  py: "text-yellow-400",
  python: "text-yellow-400",
  js: "text-yellow-300",
  javascript: "text-yellow-300",
  ts: "text-blue-400",
  typescript: "text-blue-400",
  tsx: "text-blue-400",
  jsx: "text-yellow-300",
  rust: "text-orange-400",
  go: "text-cyan-400",
  java: "text-red-400",
  rb: "text-red-500",
  ruby: "text-red-500",
};

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  createdAt: Date;
}

export interface MediaViewerProps {
  src: string;
  type: "image" | "pdf" | "code";
  fileName: string;
  language?: string;
  initialLikes?: number;
  initialLiked?: boolean;
  initialSaved?: boolean;
  initialComments?: Comment[];
  onLikeChange?: (liked: boolean, totalLikes: number) => void;
  onSaveChange?: (saved: boolean) => void;
  onCommentAdd?: (comment: string) => void;
  className?: string;
}

export function MediaViewer({
  src,
  type,
  fileName,
  language,
  initialLikes = 0,
  initialLiked = false,
  initialSaved = false,
  initialComments = [],
  onLikeChange,
  onSaveChange,
  onCommentAdd,
  className,
}: MediaViewerProps) {
  const [liked, setLiked] = React.useState(initialLiked);
  const [likes, setLikes] = React.useState(initialLikes);
  const [saved, setSaved] = React.useState(initialSaved);
  const [comments, setComments] = React.useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [codeContent, setCodeContent] = React.useState("");
  const profile = useProfile();

  React.useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  React.useEffect(() => {
    if (type === "code") {
      fetch(src)
        .then((res) => res.text())
        .then((text) => setCodeContent(text));
    }
  }, [src, type]);

  React.useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);
  React.useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const handleLike = () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;
    setLiked(newLiked);
    setLikes(newLikes);
    onLikeChange?.(newLiked, newLikes);
  };

  const handleSave = () => {
    const newSaved = !saved;
    setSaved(newSaved);
    onSaveChange?.(newSaved);
  };

  const handleCopy = async () => {
    if (type === "code") {
      await navigator.clipboard.writeText(src);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !profile) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: profile?.username,
      text: newComment.trim(),
      createdAt: new Date(),
    };
    setComments([...comments, comment]);
    setNewComment("");
    onCommentAdd?.(comment.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const getFileIcon = () => {
    switch (type) {
      case "image":
        return <ImageIcon className="size-4" />;
      case "pdf":
        return <FileText className="size-4" />;
      case "code":
        return <FileCode className="size-4" />;
    }
  };

  const getLanguageColor = () => {
    if (!language) return "text-muted-foreground";
    return languageColors[language.toLowerCase()] || "text-muted-foreground";
  };

  const lineCount = type === "code" ? codeContent.split("\n").length : 0;

  return (
    <div className={cn("flex flex-col lg:flex-row gap-4", className)}>
      {/* Main Content - Large viewer */}
      <div className="flex-1 min-w-0 flex flex-col rounded-xl border bg-card overflow-hidden">
        {/* File Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-secondary/30">
          <div
            className={cn(
              "flex items-center justify-center size-8 rounded-md bg-secondary",
              getLanguageColor(),
            )}
          >
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate text-card-foreground">
              {fileName}
            </p>
            {type === "code" && (
              <p className="text-xs text-muted-foreground">{lineCount} lines</p>
            )}
          </div>
          {type === "code" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="size-4 mr-1.5" />
              ) : (
                <Copy className="size-4 mr-1.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </div>

        {/* Content Area - Full size */}
        <div className="flex-1 bg-secondary/20">
          {type === "image" && (
            <div className="flex items-center justify-center p-4 min-h-[400px]">
              <img
                src={src}
                alt={fileName}
                className="max-w-full max-h-[600px] object-contain rounded-lg"
              />
            </div>
          )}

          {type === "pdf" && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-[400px]">
              <FileText className="size-20 text-muted-foreground" />
              <p className="text-muted-foreground">{fileName}</p>
              <Button variant="outline" asChild>
                <a href={src} target="_blank" rel="noopener noreferrer">
                  Open PDF
                </a>
              </Button>
            </div>
          )}

          {type === "code" && (
            <div className="overflow-auto min-h-[400px] max-h-[700px]">
              <table className="w-full text-sm font-mono">
                <tbody>
                  {codeContent.split("\n").map((line, i) => (
                    <tr key={i} className="hover:bg-secondary/50">
                      <td className="px-4 py-0.5 text-right text-muted-foreground select-none w-12 border-r border-border/50">
                        {i + 1}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-0.5 whitespace-pre",
                          getLanguageColor(),
                        )}
                      >
                        {line || " "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Actions - Only visible on small screens */}
        <div className="lg:hidden border-t">
          <div className="flex items-center gap-2 px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "gap-2",
                liked && "text-red-500 hover:text-red-600",
              )}
            >
              <Heart className={cn("size-5", liked && "fill-current")} />
              <span>{likes}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="size-5" />
              <span>{comments.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={cn("ml-auto", saved && "text-primary")}
            >
              <Bookmark className={cn("size-5", saved && "fill-current")} />
            </Button>
          </div>

          {/* Mobile Comments */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Send className="size-4" />
              </Button>
            </div>
            {comments.length > 0 && (
              <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop only */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 rounded-xl border bg-card overflow-hidden">
        {/* Actions */}
        <div className="flex items-center gap-2 p-4 border-b">
          <Button
            variant={liked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className={cn(
              "gap-2 flex-1",
              liked && "bg-red-500 hover:bg-red-600 border-red-500",
            )}
          >
            <Heart className={cn("size-4", liked && "fill-current")} />
            <span>{likes}</span>
          </Button>

          <Button
            variant={saved ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            className="gap-2 flex-1"
          >
            <Bookmark className={cn("size-4", saved && "fill-current")} />
            <span>{saved ? "Saved" : "Save"}</span>
          </Button>
        </div>

        {/* Comments Header */}
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium text-sm text-card-foreground flex items-center gap-2">
            <MessageCircle className="size-4" />
            Comments ({comments.length})
          </h3>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <MessageCircle className="size-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No comments yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Be the first to comment
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>

        {/* Add Comment Input */}
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={comment.avatar} alt={comment.author} />
        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
          {comment.author.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm text-card-foreground">
            {comment.author}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{comment.text}</p>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  return `${diffDay}d`;
}
