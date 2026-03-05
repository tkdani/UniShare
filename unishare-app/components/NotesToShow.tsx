"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { convertShortname } from "@/lib/utils";
import Image from "next/image";
import FileViewer from "./FileViewer";

export default function NotesToShow({ file }: any) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                {convertShortname(file.university)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{file.course}</BreadcrumbLink>
            </BreadcrumbItem>
            {file.lesson ? (
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{file.lesson}</BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbSeparator />
            )}
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{file.file_name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <FileViewer filename={file.file_name} publicUrl={file.url} />
    </div>
  );
}
