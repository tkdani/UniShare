"use client";

import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { Button } from "./ui/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/Collapsible";
import { convertShortname } from "@/lib/utils";

type FileTreeItem =
  | { name: string; path: string }
  | { name: string; items: FileTreeItem[] };

export function convertToFileTree(files: UserFile[]): FileTreeItem[] {
  const grouped: Record<string, any> = {};

  for (const file of files) {
    const short_uni = convertShortname(file.university);
    const keys = [short_uni, file.course, file.lesson].filter(
      Boolean,
    ) as string[];

    let current = grouped;

    for (const key of keys) {
      if (!current[key]) current[key] = {};
      current = current[key];
    }

    current[file.file_name] = null;
  }

  const buildTree = (node: Record<string, any>, path = ""): FileTreeItem[] => {
    return Object.entries(node).map(([name, children]) => {
      const currentPath = path ? `${path}/${name}` : name;

      if (children === null) {
        return { name, path: currentPath };
      }
      return {
        name,
        items: buildTree(children, currentPath),
      };
    });
  };

  return buildTree(grouped);
}

export default function CollapsibleFileTree({ files, onSetSelectedFile }: any) {
  const fileTree: FileTreeItem[] = convertToFileTree(files);

  const renderItem = (fileItem: FileTreeItem) => {
    if ("items" in fileItem) {
      return (
        <Collapsible key={fileItem.name}>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
              >
                <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                <FolderIcon />
                {fileItem.name}
              </Button>
            }
          ></CollapsibleTrigger>
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
        onClick={() => onSetSelectedFile(fileItem.path)}
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
