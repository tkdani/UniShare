"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/Sheet";
import DarkModeSwitch from "./DarkModeSwitch";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        }
      ></SheetTrigger>

      <SheetContent side="left" className="max-w-48">
        <div className="flex flex-col gap-0 mt-10">
          <Link
            className="hover:bg-accent hover:text-accent-foreground p-2"
            href="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            className="hover:bg-accent hover:text-accent-foreground p-2"
            href="/statistics"
            onClick={() => setOpen(false)}
          >
            Statistics
          </Link>
          <Link
            className="hover:bg-accent hover:text-accent-foreground p-2"
            href="/saved"
            onClick={() => setOpen(false)}
          >
            Saved
          </Link>
          <Link
            className="hover:bg-accent hover:text-accent-foreground p-2"
            href="/notes"
            onClick={() => setOpen(false)}
          >
            Notes
          </Link>
        </div>
        <div className="pt-4 border-t flex items-center justify-between p-2">
          <span>Theme</span>
          <DarkModeSwitch />
        </div>
      </SheetContent>
    </Sheet>
  );
}
