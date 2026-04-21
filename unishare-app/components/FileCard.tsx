"use client";

import Image from "next/image";
import { Badge } from "./ui/Badge";
import { cn } from "@/lib/utils";
import { IconHexagonPlus, IconHeart } from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";

export default function FileCard({ width, file }: any) {
  return (
    <Card
      size="sm"
      className={cn(
        "relative mx-auto max-w-sm pt-0 hover:scale-105 duration-100 ease-in-out",
        width,
      )}
    >
      <div className="absolute inset-0 z-30 aspect-square" />
      <Image
        src={file.url}
        alt="alt"
        className="relative z-20 aspect-3/4 object-cover brightness-60 dark:brightness-40 w-full"
        width={400}
        height={300}
        unoptimized
        loading="eager"
      />

      <CardHeader>
        <CardAction>
          <Badge variant={file.type == "Exam" ? "default" : "secondary"}>
            {file.type}
          </Badge>
        </CardAction>
        <CardTitle>{file.course}</CardTitle>
        <CardDescription className="flex justify-between text-xs w-full">
          {file.lesson ? `${file.university} -${file.lesson}` : file.university}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row justify-between">
        <Badge variant="outline">{file.like_count}</Badge>
        <div className="flex gap-2">
          <IconHeart />
          <IconHexagonPlus />
        </div>
      </CardFooter>
    </Card>
  );
}
