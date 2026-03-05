"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import UploadFileMenu from "./UploadFileMenu";
import SideBar from "./SideBar";
import NotesToShow from "./NotesToShow";
import { useEffect, useState } from "react";
import { Separator } from "./ui/Separator";
import DeepSearch from "./DeepSearch";
import CollapsibleFileTree from "./CollapsibleFileTree";
import { createClient } from "@/lib/supabase/client";

export default function NotesPage() {
  const supabase = createClient();
  const [files, setFiles] = useState<UserFile[] | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data: initialFiles } = await supabase
        .from("user_files")
        .select("*");
      setFiles(initialFiles);
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    const fetchFile = async (url: string) => {
      const { data, error } = await supabase
        .from("user_files")
        .select("*")
        .eq("url", url)
        .single();
      setSelectedFile(data);
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
          Notes
        </div>
        <Separator />
        <DeepSearch />
        <Separator />
        {files && (
          <CollapsibleFileTree
            files={files}
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
