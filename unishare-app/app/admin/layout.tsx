export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r flex flex-col gap-1 p-4">
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
      </aside>
      {/* Main */}
      <main className="flex-1 p-8 bg-background">{children}</main>
    </div>
  );
}
