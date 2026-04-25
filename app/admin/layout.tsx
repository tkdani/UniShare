import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  function MenuPanel({ className }: any) {
    return (
      <div
        className={
          (cn(
            "w-60 bg-card border-r flex flex-col gap-1 p-4 self-start rounded",
          ),
          className)
        }
      >
        <p className="text-xs text-muted-foreground font-medium px-2 mb-2">
          ADMIN
        </p>
        <a
          href="/"
          className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary text-sm"
        >
          Back Home
        </a>
        <a
          href="/admin"
          className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary text-sm"
        >
          Dashboard
        </a>
        <a
          href="/admin/users"
          className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary text-sm"
        >
          Users
        </a>
        <a
          href="/admin/content"
          className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary text-sm"
        >
          Content
        </a>
      </div>
    );
  }
  function MobileMenuPanel({ className }: any) {
    return (
      <div className={className}>
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            }
          ></SheetTrigger>
          <SheetContent side="left" className="max-w-48">
            <div className="text-lg text-muted-foreground font-medium px-2 mb-2">
              Admin
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-2 py-2 hover:bg-secondary text-sm"
            >
              Back Home
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-2 py-2 hover:bg-secondary text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-2 py-2 hover:bg-secondary text-sm"
            >
              Users
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-2 py-2 hover:bg-secondary text-sm"
            >
              Content
            </Link>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <MenuPanel className="hidden md:block" />
      <MobileMenuPanel className="md:hidden block" />
      {/* Main */}
      <main className="flex-1 p-8 bg-background">{children}</main>
    </div>
  );
}
