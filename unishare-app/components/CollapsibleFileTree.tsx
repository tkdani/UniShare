import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

export function CollapsibleFileTree() {
  const fileTree: FileTreeItem[] = [
    {
      name: "ELTE",
      items: [
        {
          name: "Webprogramozás",
          items: [
            {
              name: "01",
              items: [
                { name: "elso_ora.txt" },
                { name: "elso_ora_kod.tsx" },
                { name: "elso_ora_felvetel.mp4" },
              ],
            },
            {
              name: "02",
              items: [{ name: "masodik_ora.txt" }],
            },
            { name: "zh1.png" },
            { name: "vizsga.png" },
          ],
        },
        {
          name: "Szakdoga",
          items: [{ name: "dokumentáció.txt" }],
        },
      ],
    },
  ];

  const renderItem = (fileItem: FileTreeItem) => {
    if ("items" in fileItem) {
      return (
        <Collapsible key={fileItem.name}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
            >
              <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
              <FolderIcon />
              {fileItem.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="style-lyra:ml-4 mt-1 ml-5">
            <div className="flex flex-col gap-1">
              {fileItem.items.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <Button
        key={fileItem.name}
        variant="link"
        size="sm"
        className="text-foreground w-full justify-start gap-2"
      >
        <FileIcon />
        <span>{fileItem.name}</span>
      </Button>
    );
  };

  return (
    <div className="flex flex-col gap-1">
      {fileTree.map((item) => renderItem(item))}
    </div>
  );
}
