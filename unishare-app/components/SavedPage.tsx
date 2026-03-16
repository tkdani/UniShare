"use client";
import useProfile from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Separator } from "./ui/Separator";
import DeepSearch from "./DeepSearch";
import CollapsibleFileTree from "./CollapsibleFileTree";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { Button } from "./ui/Button";
import { ArrowDownUpIcon } from "lucide-react";
import UploadFileMenu from "./UploadFileMenu";
import NotesToShow from "./NotesToShow";

export default function SavedPage() {
  const supabase = createClient();
  const profile = useProfile();
  const [savedFiles, setSavedFiles] = useState<UserFile[] | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      const fetchFiles = async () => {
        const { data, error } = await supabase
          .from("file_saves")
          .select("*, user_files (*)")
          .eq("user_id", profile.id);
        if (error) console.log(error);
        const files = data?.map((item) => item.user_files) ?? null;
        setSavedFiles(files);
      };

      fetchFiles();
    }
  }, [profile]);

  useEffect(() => {
    const fetchFile = async (url: string) => {
      const { data, error } = await supabase
        .from("file_saves")
        .select("*, user_files!inner (*)")
        .eq("user_files.url", url)
        .single();
      if (error) console.log(error);
      setSelectedFile(data.user_files);
    };

    if (selectedFilePath) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("files").getPublicUrl(selectedFilePath);

      fetchFile(publicUrl);
    }
  }, [selectedFilePath]);

  return (
    <div className="flex gap-3 justify-between">
      <div className="flex max-w-md w-1/5 flex-col gap-4 text-sm p-4 bg-sidebar rounded-md">
        <div className="text-2xl font-extrabold tracking-tight text-balance">
          Saved
        </div>
        <Separator />
        {savedFiles && (
          <CollapsibleFileTree
            files={savedFiles}
            onSetSelectedFile={setSelectedFilePath}
          />
        )}
      </div>
      <div className="w-full">
        <div className="flex justify-between border-b pb-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline">
                  <ArrowDownUpIcon />
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort</DropdownMenuLabel>
                <DropdownMenuItem>University</DropdownMenuItem>
                <DropdownMenuItem>Course</DropdownMenuItem>
                <DropdownMenuItem>Class</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <UploadFileMenu />
        </div>
        {selectedFile && <NotesToShow file={selectedFile} />}
      </div>
    </div>
  );
}
