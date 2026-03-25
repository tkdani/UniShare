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
  Sparkles,
  RefreshCw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuTrigger,
} from "./ui/ContextMenu";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser } from "./UserProvider";

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
  authorId?: string;
  author: string;
  avatar?: string;
  text: string;
  createdAt: Date;
}
type SidebarTab = "comments" | "ai";

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
  postOwnerId?: string;
  isBlocked?: boolean;
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
  postOwnerId,
  isBlocked,
}: MediaViewerProps) {
  const [liked, setLiked] = React.useState(initialLiked);
  const [likes, setLikes] = React.useState(initialLikes);
  const [saved, setSaved] = React.useState(initialSaved);
  const [comments, setComments] = React.useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [codeContent, setCodeContent] = React.useState("");
  const profile = getUser();
  const supabase = createClient();
  const [blockedUserIds, setBlockedUserIds] = React.useState<Set<string>>(
    new Set(),
  );

  const [activeTab, setActiveTab] = React.useState<SidebarTab>("comments");
  // ai
  const [aiSummary, setAiSummary] = React.useState("");
  const [isLoadingSummary, setIsLoadingSummary] = React.useState(false);
  const [summaryGenerated, setSummaryGenerated] = React.useState(false);
  const [summaryError, setSummaryError] = React.useState<string | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    if (!profile) return;
    const fetchBlockedUsers = async () => {
      const { data } = await supabase
        .from("blocked_users")
        .select("blocked_id")
        .eq("blocker_id", profile.id);

      if (data) {
        setBlockedUserIds(new Set(data.map((b) => b.blocked_id)));
      }
    };

    fetchBlockedUsers();
  }, [profile]);

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
    if (!profile) {
      router.push("/login");
      return;
    }
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;
    setLiked(newLiked);
    setLikes(newLikes);
    onLikeChange?.(newLiked, newLikes);
  };

  const handleSave = () => {
    if (!profile) {
      router.push("/login");
      return;
    }

    const newSaved = !saved;
    setSaved(newSaved);
    onSaveChange?.(newSaved);
  };
  const handleDownload = async () => {
    const a = document.createElement("a");
    a.href = `/api/download?url=${encodeURIComponent(src)}&fileName=${encodeURIComponent(fileName)}`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    if (type === "code") {
      await navigator.clipboard.writeText(src);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBlock = async (blockedUserId: string | undefined) => {
    if (!blockedUserId || !profile) return;

    const { data: existing } = await supabase
      .from("blocked_users")
      .select("id")
      .eq("blocker_id", profile.id)
      .eq("blocked_id", blockedUserId)
      .maybeSingle();

    if (existing) {
      await supabase.from("blocked_users").delete().eq("id", existing.id);
      setBlockedUserIds((prev) => {
        const next = new Set(prev);
        next.delete(blockedUserId);
        return next;
      });
    } else {
      await supabase
        .from("blocked_users")
        .insert({ blocker_id: profile.id, blocked_id: blockedUserId });
      setBlockedUserIds((prev) => new Set(prev).add(blockedUserId));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !profile || profile.is_banned) return;
    const { data: blockData } = await supabase
      .from("blocked_users")
      .select("id")
      .eq("blocker_id", postOwnerId)
      .eq("blocked_id", profile.id)
      .maybeSingle();

    if (blockData) return;
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

  const generateSummary = async () => {
    setIsLoadingSummary(true);
    setAiSummary("");
    setSummaryError(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: src,
          fileName,
          fileType: type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate summary");
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "text-delta" && parsed.delta) {
                fullContent += parsed.delta;
                setAiSummary(fullContent);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      setSummaryGenerated(true);
    } catch (error) {
      setSummaryError(
        error instanceof Error ? error.message : "Failed to generate summary",
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === "ai" && !summaryGenerated && !isLoadingSummary) {
      generateSummary();
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
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            asChild
            onClick={handleDownload}
          >
            <a href={src} download={fileName}>
              <Download className="size-4 mr-1.5" />
              Download
            </a>
          </Button>
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
              disabled={profile?.is_banned}
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
                disabled={profile?.is_banned || !profile}
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
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onBlock={handleBlock}
                    isBlockedUser={blockedUserIds.has(comment.authorId ?? "")}
                  />
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
            disabled={profile?.is_banned || isBlocked}
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

        <div className="flex border-b">
          <button
            onClick={() => handleTabChange("comments")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium transition-colors",
              activeTab === "comments"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <MessageCircle className="size-4 inline mr-1.5" />
            Comments ({comments.length})
          </button>
          {type == "code" ? (
            <button
              disabled={type != "code"}
              onClick={() => handleTabChange("ai")}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors",
                activeTab === "ai"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Sparkles className="size-4 inline mr-1.5" />
              AI Summary
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "comments" ? (
            <>
              {/* Comments List */}
              <div className="flex-1 overflow-y-auto">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <MessageCircle className="size-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No comments yet
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Be the first to comment
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUserId={profile?.id}
                        onBlock={() => handleBlock(comment.authorId)}
                        isBlockedUser={blockedUserIds.has(
                          comment.authorId ?? "",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Add Comment Input */}
              {isBlocked ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-dashed">
                  <span className="text-xs text-muted-foreground">
                    You are blocked by the user.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    disabled={profile?.is_banned || !profile}
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
              )}
            </>
          ) : (
            <div className="flex-1 p-4 overflow-y-auto">
              <AISummaryContent
                summary={aiSummary}
                isLoading={isLoadingSummary}
                error={summaryError}
                onRegenerate={generateSummary}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onBlock,
  isBlockedUser,
}: {
  comment: Comment;
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

function AISummaryContent({
  summary,
  isLoading,
  error,
  onRegenerate,
}: {
  summary: string;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
}) {
  if (isLoading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          <Sparkles className="size-10 text-primary animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Generating summary...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <Sparkles className="size-4 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-destructive leading-relaxed">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Please check that AI Gateway is properly configured.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="w-full gap-2"
        >
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-card-foreground leading-relaxed">
            {summary || "Click to generate an AI summary of this file."}
          </p>
          {isLoading && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
          )}
        </div>
      </div>

      {summary && !isLoading && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="w-full gap-2"
        >
          <RefreshCw className="size-4" />
          Regenerate
        </Button>
      )}
    </div>
  );
}
