import { useState } from "react";
import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { ArrowDownUpIcon } from "lucide-react";

export default function SortItems() {
  const [sortBy, setSortBy] = useState<
    "university" | "course" | "file_name" | null
  >(null);

  return (
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
  );
}
