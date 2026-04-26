"use client";

import { useState, useRef, useEffect } from "react";
import { FileIcon, SearchIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/InputGroup";
import { Kbd } from "./ui/Kbd";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/Dialog";

export function SearchBar() {
  const supabase = createClient();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<UserFile[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const search = async () => {
      const { data } = await supabase
        .from("user_files")
        .select("*")
        .or(
          `file_name.ilike.%${query}%,university.ilike.%${query}%,course.ilike.%${query}%,lesson.ilike.%${query}%`,
        )
        .limit(5);

      setSuggestions(data ?? []);
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (file: UserFile) => {
    router.push(`/notes?file=${encodeURIComponent(file.url)}`);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative max-w-sm w-full">
      <div className="hidden sm:block">
        <InputGroup className="max-w-sm">
          <InputGroupInput
            id="search-id"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => query.length >= 2 && setOpen(true)}
          />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </div>
      {/* <div className="sm:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <SearchIcon />
        </Button>
      </div> */}
      <div className="sm:hidden">
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger
            render={
              <Button variant="ghost" size="icon">
                <SearchIcon />
              </Button>
            }
          />
          <DialogContent className="p-4 w-max" showCloseButton={false}>
            <InputGroup className="w-max">
              <InputGroupInput
                autoFocus
                placeholder="Search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>

            {/* results */}
            {open && suggestions.length > 0 && (
              <div className="mt-3 flex flex-col gap-1">
                {suggestions.map((file) => (
                  <button
                    key={file.id}
                    className="cursor-pointer flex items-center gap-3 p-2 text-sm hover:bg-accent rounded-md"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleSelect(file);
                      setMobileOpen(false);
                    }}
                  >
                    <FileIcon className="size-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-left">
                        {file.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate text-left">
                        {file.university} / {file.course}
                        {file.lesson ? ` / ${file.lesson}` : ""}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-popover shadow-md z-50 overflow-hidden">
          {suggestions.map((file) => (
            <button
              key={file.id}
              className="cursor-pointer  w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent text-left"
              onClick={() => handleSelect(file)}
            >
              <FileIcon className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{file.file_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {file.university} / {file.course}
                  {file.lesson ? ` / ${file.lesson}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-popover shadow-md z-50 px-3 py-4 text-sm text-muted-foreground text-center">
          No results
        </div>
      )}
    </div>
  );
}
