import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import { SearchIcon } from "lucide-react";
import { Kbd } from "./ui/Kbd";

export default function SearchBar() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput id="search-id" placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}
