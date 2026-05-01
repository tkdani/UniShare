"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ArrowDownUpIcon, TextSearch } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";

export default function SavedPage() {
  const [savedFiles, setSavedFiles] = useState<UserFile[] | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const supabase = createClient();
  const user = useUser();
  const [sortBy, setSortBy] = useState<
    "university" | "course" | "file_name" | null
  >(null);
  const [open, setOpen] = useState(false);

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

  const sortedFiles = sortBy
    ? [...(savedFiles ?? [])].sort((a, b) => {
        const valA = a[sortBy] ?? "";
        const valB = b[sortBy] ?? "";
        return valA.localeCompare(valB);
      })
    : savedFiles;

  function SidePanel({ className, setOpen }: any) {
    return (
      <div
        className={cn(
          "flex max-w-72 min-w-72 flex-col gap-4 text-sm p-4 bg-sidebar rounded-md self-start",
          className,
        )}
      >
        {savedFiles && (
          <CollapsibleFileTree
            files={sortedFiles}
            onSetSelectedFile={setSelectedFilePath}
            setOpen={setOpen}
          />
        )}
      </div>
    );
  }

  function SidePanelMobile({ className, open, setOpen }: any) {
    return (
      <div className={className}>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline">
                <TextSearch />
              </Button>
            }
          ></SheetTrigger>
          <SheetContent side="left" className="rounded p-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="w-max">
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
                      setOpen(true);
                    }}
                  >
                    University
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("course");
                      setOpen(true);
                    }}
                  >
                    Course
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("file_name");
                      setOpen(true);
                    }}
                  >
                    Name
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <SidePanel setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  function SortItemsPanel({ className }: any) {
    return (
      <div className={className}>
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
                Name
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex gap-3 justify-between">
      <SidePanel className="hidden lg:flex" setOpen={setOpen} />
      <div className="w-full">
        <div className="w-full">
          <div className="flex justify-between border-b pb-1 w-full">
            <SortItemsPanel className="hidden lg:block" />
            <SidePanelMobile
              className="lg:hidden"
              open={open}
              setOpen={setOpen}
            />
          </div>
        </div>
        {selectedFile && (
          <NotesToShow
            file={selectedFile}
            onDelete={(id: string) => {
              setSavedFiles((prev) => prev?.filter((f) => f.id !== id) ?? null);
              setSelectedFile(null);
              setSelectedFilePath(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
