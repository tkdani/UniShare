import React from "react";
import { Separator } from "@/components/ui/separator";

const HomePage = () => {
  return (
    <div className="mt-4 flex max-w-md flex-col gap-4 text-sm p-4 border rounded">
      <div className="flex flex-col gap-1.5">
        <div className="text-4xl font-extrabold tracking-tight text-balance">
          UniShare
        </div>
        <div className="text-muted-foreground">By Takács Dániel</div>
      </div>
      <Separator />
      <div>
        A websites dedicated for university students to store all your learning
        materials for each class.
      </div>
    </div>
  );
};

export default HomePage;
