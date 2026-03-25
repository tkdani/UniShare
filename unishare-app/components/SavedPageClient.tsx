"use client";

import { ArrowDownUpIcon } from "lucide-react";
import CollapsibleFileTree from "./CollapsibleFileTree";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { Separator } from "./ui/Separator";
import { Button } from "./ui/Button";
import UploadFileMenu from "./UploadFileMenu";

interface SavedPageClientProps {
  savedFiles: UserFile;
}

export default function SavedPageClient({ savedFiles }: SavedPageClientProps) {
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
