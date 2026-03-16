"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { convertShortname } from "@/lib/utils";
import { Comment, MediaViewer } from "./MediaViewer";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import useProfile from "@/hooks/useProfile";

function getFileType(filename: string): "image" | "pdf" | "code" {
  if (
    filename.includes(".png") ||
    filename.includes(".jpeg") ||
    filename.includes(".jpg")
  )
    return "image";
  if (filename.includes(".pdf")) return "pdf";
  return "code";
}

export default function NotesToShow({ file }: any) {
  const supabase = createClient();
  const [alreadyLiked, setAlreadyLiked] = useState<boolean>(false);
  const [alreadySaved, setAlreadySaved] = useState<boolean>(false);
  const [initialComments, setInitialComments] = useState<Comment[]>([]);
  const profile = useProfile();
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  useEffect(() => {
    const check = async () => {
      if (!profile) return;
      const { data: blockedData } = await supabase
        .from("blocked_users")
        .select("id")
        .eq("blocker_id", file.owner_id)
        .eq("blocked_id", profile.id)
        .maybeSingle();
      setIsBlocked(!!blockedData);

      const { data: likedData } = await supabase
        .from("file_likes")
        .select("id")
        .eq("user_id", profile.id)
        .eq("file_id", file.id)
        .maybeSingle();

      const { data: savedData } = await supabase
        .from("file_saves")
        .select("id")
        .eq("user_id", profile.id)
        .eq("file_id", file.id)
        .maybeSingle();

      const { data: comments } = await supabase
        .from("comments")
        .select("*, profiles(username, avatar_url)") // join egy lekéréssel
        .eq("file_id", file.id);

      if (!comments) return;

      const commentsArr: Comment[] = await Promise.all(
        comments.map(async (c) => {
          let avatarUrl: string | undefined = undefined;
          if (c.profiles?.avatar_url) {
            const { data: avatarData } = await supabase.storage
              .from("avatars")
              .createSignedUrl(c.profiles.avatar_url, 3600);
            avatarUrl = avatarData?.signedUrl ?? undefined;
          }

          return {
            id: c.id,
            authorId: c.user_id,
            author: c.profiles.username,
            avatar: avatarUrl,
            text: c.content,
            createdAt: new Date(c.created_at),
          };
        }),
      );

      setInitialComments(commentsArr);

      setInitialComments(commentsArr);
      setAlreadyLiked(!!likedData);
      setAlreadySaved(!!savedData);
    };
    check();
  }, [file, profile]);

  const addComment = async (comment: string) => {
    if (!profile) return;
    await supabase
      .from("comments")
      .insert({ file_id: file.id, user_id: profile.id, content: comment });
  };

  const updateSave = async (saved: boolean) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user.id;

    if (saved) {
      await supabase
        .from("file_saves")
        .insert({ user_id: userId, file_id: file.id });
    } else {
      await supabase
        .from("file_saves")
        .delete()
        .eq("user_id", userId)
        .eq("file_id", file.id);
    }
  };

  const updateLikeCount = async (
    liked: boolean,
    totalLikes: number,
    id: string,
  ) => {
    if (profile) {
      if (liked) {
        await supabase
          .from("file_likes")
          .insert({ user_id: profile.id, file_id: id });
      } else {
        await supabase
          .from("file_likes")
          .delete()
          .eq("user_id", profile.id)
          .eq("file_id", id);
      }

      await supabase
        .from("user_files")
        .update({ like_count: totalLikes })
        .eq("id", id);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                {convertShortname(file.university)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{file.course}</BreadcrumbLink>
            </BreadcrumbItem>
            {file.lesson ? (
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{file.lesson}</BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbSeparator />
            )}
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{file.file_name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <MediaViewer
        key={file.url}
        fileName={file.file_name}
        src={file.url}
        type={getFileType(file.file_name)}
        initialLiked={alreadyLiked}
        initialLikes={file.like_count}
        onLikeChange={(liked, totalLikes) =>
          updateLikeCount(liked, totalLikes, file.id)
        }
        initialSaved={alreadySaved}
        onSaveChange={(saved) => updateSave(saved)}
        initialComments={initialComments}
        onCommentAdd={(comment) => {
          addComment(comment);
        }}
        postOwnerId={file.owner_id}
        isBlocked={isBlocked}
      />
    </div>
  );
}
