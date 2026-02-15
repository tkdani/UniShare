import React from "react";
import EmptyNotes from "./EmptyNotes";
import UploadFileMenu from "./UploadFileMenu";
import SideBar from "./SideBar";
import NotesToShow from "./NotesToShow";
import { ArrowDownUpIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const NotesPage = () => {
  return (
    <div className="flex gap-3 justify-between">
      <SideBar title="Notes" />
      <div className="w-full">
        <div className="flex justify-between border-b pb-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowDownUpIcon />
              </Button>
            </DropdownMenuTrigger>
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
        <NotesToShow />
      </div>
    </div>
  );
};

export default NotesPage;
