import { FileText, Heart } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export default function UploadedFiles({ profile }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Uploaded Files ({profile.stats.uploads})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {profile.uploadedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              Haven't uploaded any files.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 w-full">
            {profile.uploadedFiles.map((file: any) => (
              <Link
                key={file.id}
                href={`/notes?file=${encodeURIComponent(file.url)}`}
                className="group block rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-foreground group-hover:text-primary">
                      {file.file_name}
                    </h3>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {file.course}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {file.university}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {file.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="h-3 w-3" />
                      {file.like_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
