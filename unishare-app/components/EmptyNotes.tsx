import React from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowUpRightIcon, FolderPlus } from "lucide-react";
import UploadFileMenu from "./UploadFileMenu";

const EmptyNotes = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderPlus />
        </EmptyMedia>
        <EmptyTitle>No Saved Notes</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t uploaded any notes yet. Get started by uplodading
          your first study note.
        </EmptyDescription>
      </EmptyHeader>
      <Button>
        <UploadFileMenu />
      </Button>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="/docs">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  );
};

export default EmptyNotes;
