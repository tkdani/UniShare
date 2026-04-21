import { createClient } from "@/lib/supabase/server";
import FileCard from "./FileCard";

export default async function NotesSlide() {
  const supabase = await createClient();
  const { data: initial_files } = await supabase
    .from("user_files")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12);
  return (
    <div className="grid grid-cols-6 border rounded p-4">
      {initial_files ? (
        initial_files.map((file) => (
          <FileCard key={file.id} file={file} width="w-48" />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
