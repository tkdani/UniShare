import NavBar from "@/components/NavBar";
import NotesPage from "@/components/NotesPage";
import React from "react";

const notes = () => {
  return (
    <div className="min-h-screen p-4">
      <NavBar />
      <NotesPage />
    </div>
  );
};

export default notes;
