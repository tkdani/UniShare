"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ArrowDownUpIcon } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import CollapsibleFileTree from "@/components/CollapsibleFileTree";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import NotesToShow from "@/components/NotesToShow";
import { useUser } from "@/components/UserProvider";

export default function SavedPage() {
  const [savedFiles, setSavedFiles] = useState<UserFile[] | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const supabase = createClient();
  const user = useUser();
  const [sortBy, setSortBy] = useState<
    "university" | "course" | "file_name" | null
  >(null);

  useEffect(() => {
    if (user) {
      const fetchFiles = async () => {
        const { data, error } = await supabase
          .from("file_saves")
          .select("*, user_files (*)")
          .eq("user_id", user.id);
        if (error) console.log(error);
        const files = data?.map((item) => item.user_files) ?? null;
        const sortedFiles = sortBy
          ? [...(files ?? [])].sort((a, b) => {
              const valA = a[sortBy] ?? "";
              const valB = b[sortBy] ?? "";
              return valA.localeCompare(valB);
            })
          : files;
        setSavedFiles(sortedFiles);
      };

      fetchFiles();
    }
  }, [user, sortBy]);

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
      fetchFile(selectedFilePath);
    }
  }, [selectedFilePath]);

  return (
    <div className="flex gap-3 justify-between">
      <div className="flex max-w-md w-1/5 flex-col gap-4 text-sm p-4 bg-sidebar rounded-md self-start">
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
        <div className="border-b pb-1">
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
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("university");
                  }}
                >
                  University
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("course");
                  }}
                >
                  Course
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("file_name");
                  }}
                >
                  Class
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {selectedFile && <NotesToShow file={selectedFile} />}
      </div>
    </div>
  );
}
