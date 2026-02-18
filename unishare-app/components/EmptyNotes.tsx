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

const EmptyNotes = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderPlus />
        </EmptyMedia>
        <EmptyTitle>No note to show</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t saved any notes yet. Get started by uplodading your
          first study note or brows some notes.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>
          <a href="/">Browse Notes</a>
        </Button>
        <Button variant="outline">
          <a href="/notes">My Notes</a>
        </Button>
      </EmptyContent>
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
