import { BookOpen } from "lucide-react";
import { FeedCard } from "./FeedCard";
import { getFeedFiles } from "@/lib/getFeedFiles";

export default async function HomePageFeed() {
  const files = await getFeedFiles(18);

  return (
    <div className="container py-8 min-w-full">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none text-foreground">
            For You
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Latest notes</p>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No files uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {files.map((file) => (
            <FeedCard key={file.id} {...file} />
          ))}
        </div>
      )}
    </div>
  );
}
