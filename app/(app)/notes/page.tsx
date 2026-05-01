"use client";

import { ArrowDownUpIcon, TextSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/Separator";
import DeepSearch from "@/components/DeepSearch";
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
import UploadFileMenu from "@/components/UploadFileMenu";
import NotesToShow from "@/components/NotesToShow";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";

type seachItemType = {
  uni?: string;
  course?: string;
  class?: number;
  name?: string;
  types: string[];
};

export default function NotesPage() {
  const supabase = createClient();
  const [files, setFiles] = useState<UserFile[] | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [searchItem, setSearchItem] = useState<seachItemType | null>(null);
  const [sortBy, setSortBy] = useState<
    "university" | "course" | "file_name" | null
  >(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const searchParams = useSearchParams();

  const fetchFile = async (url: string) => {
    const { data } = await supabase
      .from("user_files")
      .select("*")
      .eq("url", url)
      .single();
    setSelectedFile(data);
  };

  useEffect(() => {
    const fileUrl = searchParams.get("file");
    if (fileUrl) {
      fetchFile(decodeURIComponent(fileUrl));
    }
  }, [searchParams]);

  const sortedFiles = sortBy
    ? [...(files ?? [])].sort((a, b) => {
        const valA = a[sortBy] ?? "";
        const valB = b[sortBy] ?? "";
        return valA.localeCompare(valB);
      })
    : files;

  useEffect(() => {
    const fetchFiles = async () => {
      const { data: initialFiles } = await supabase
        .from("user_files")
        .select("*");
      setFiles(initialFiles);
    };

    const hasFilter =
      searchItem?.uni || searchItem?.course || searchItem?.class;
    if (hasFilter) fetchFiles();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      let query = supabase.from("user_files").select("*");

      if (searchItem?.uni)
        query = query.ilike("university", `%${searchItem.uni}%`);
      if (searchItem?.course)
        query = query.ilike("course", `%${searchItem.course}%`);
      if (searchItem?.class) query = query.eq("class", searchItem.class);
      if (searchItem?.name)
        query = query.ilike("file_name", `%${searchItem.name}%`);
      if (searchItem?.types) query = query.in("type", searchItem.types);
      const { data: files, error } = await query;

      setFiles(files ?? null);
    };

    fetchFiles();
  }, [searchItem, refreshKey]);

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
      fetchFile(selectedFilePath);
    }
  }, [selectedFilePath]);

  function SidePanel({ className, setOpen }: any) {
    return (
      <div
        className={cn(
          "flex flex-col gap-4 text-sm p-4 bg-sidebar rounded-md w-72",
          className,
        )}
      >
        <DeepSearch
          onSearch={setSearchItem}
          setOpen={(val: boolean) => {
            if (window.innerWidth < 1024) setOpen(val);
          }}
        />
        <Separator />
        {files && (
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
          <SheetContent
            side="left"
            className="rounded p-2 min-w-max max-w-max flex flex-col h-full"
          >
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
            <div className="flex-1 overflow-y-auto min-h-0">
              <SidePanel setOpen={setOpen} />
            </div>
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
            <UploadFileMenu onUpload={() => setRefreshKey((k) => k + 1)} />
          </div>
        </div>
        {selectedFile && (
          <NotesToShow
            file={selectedFile}
            onDelete={(id: string) => {
              setFiles((prev) => prev?.filter((f) => f.id !== id) ?? null);
              setSelectedFile(null);
              setSelectedFilePath(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
