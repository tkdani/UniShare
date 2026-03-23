import { DeleteFileButton } from "@/components/DeleteFileButton";
import { createClient } from "@/lib/supabase/server";

export default async function AdminContent() {
  const supabase = await createClient();
  const { data: files } = await supabase
    .from("user_files")
    .select("id, file_name, university, course, like_count, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Uploaded Files</h1>
      <div className="rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground border-b">
              <th className="text-left p-4">File</th>
              <th className="text-left p-4">University / Course</th>
              <th className="text-left p-4">Uploaded</th>
              <th className="text-right p-4">Operation</th>
            </tr>
          </thead>
          <tbody>
            {files?.map((file) => (
              <tr key={file.id} className="border-b last:border-0">
                <td className="p-4">{file.file_name}</td>
                <td className="p-4 text-muted-foreground">
                  {file.university} / {file.course}
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(file.created_at).toLocaleDateString("hu")}
                </td>
                <td className="p-4 text-right">
                  <DeleteFileButton fileId={file.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
