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

export default function NotesPage() {
  return (
    <div className="flex gap-3 justify-between">
      <SideBar />
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
        <NotesToShow />
      </div>
    </div>
  );
}
