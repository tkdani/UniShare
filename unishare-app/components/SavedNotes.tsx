import React from "react";
import EmptyNotes from "./EmptyNotes";
import SideBar from "./SideBar";
import NotesPage from "./NotesPage";

const SavedNotes = () => {
  return (
    <div className="flex flex-row">
      <SideBar title="Saved Notes" />
      <NotesPage />
    </div>
  );
};

export default SavedNotes;
