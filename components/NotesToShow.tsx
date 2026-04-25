"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { convertShortname } from "@/lib/utils";
import { MediaViewer } from "./MediaViewer";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./UserProvider";

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

export default function NotesToShow({ file, onDelete }: any) {
  const supabase = createClient();
  const [alreadyLiked, setAlreadyLiked] = useState<boolean>(false);
  const [alreadySaved, setAlreadySaved] = useState<boolean>(false);
  const [initialComments, setInitialComments] = useState<CommentType[]>([]);
  const profile = useUser();
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [owner, setOwner] = useState<User | null>(null);
  const [signedAvatarUrl, setSignedAvatarUrl] = useState<string | null>(null);
  const [signedFileUrl, setSignedFileUrl] = useState<any>(null);

  useEffect(() => {
    const getSigned = async () => {
      const { data } = await supabase.storage
        .from("files")
        .createSignedUrl(file.url, 3600);

      setSignedFileUrl(data?.signedUrl ?? null);
    };

    getSigned();
  }, [file.url]);

  useEffect(() => {
    const checkProfile = async () => {
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

      setAlreadyLiked(!!likedData);
      setAlreadySaved(!!savedData);
    };
    const check = async () => {
      const { data: owner } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", file.owner_id)
        .single();
      setOwner(owner);

      if (owner?.avatar_url) {
        const { data: signedData, error } = await supabase.storage
          .from("avatars")
          .createSignedUrl(owner.avatar_url, 3600);

        if (signedData) {
          setSignedAvatarUrl(signedData.signedUrl);
        }
      }

      const { data: comments } = await supabase
        .from("comments")
        .select("*, profiles(username, avatar_url)")
        .eq("file_id", file.id);

      if (!comments) return;

      const commentsArr: CommentType[] = await Promise.all(
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
    };
    check();
    checkProfile();
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
            <BreadcrumbSeparator />
            {file.lesson && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">{file.lesson}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{file.file_name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {signedFileUrl && (
        <MediaViewer
          key={file.url}
          fileName={file.file_name}
          upload_date={file.created_at}
          src={signedFileUrl}
          owner={owner}
          avatarUrl={signedAvatarUrl}
          type={getFileType(file.file_name)}
          fileId={file.id}
          onDelete={onDelete}
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
      )}
    </div>
  );
}
