import NavBar from "@/components/NavBar";
import NotesPage from "@/components/NotesPage";
import { Suspense } from "react";

export default function Notes() {
  return (
    <div className="min-h-screen p-4">
      <NavBar />
      <NotesPage />
    </div>
  );
}
