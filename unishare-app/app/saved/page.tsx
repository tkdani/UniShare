import NavBar from "@/components/NavBar";
import SavedNotes from "@/components/SavedNotes";
import React from "react";

const saved = () => {
  return (
    <div className="p-4">
      <NavBar />
      <SavedNotes />
    </div>
  );
};

export default saved;
