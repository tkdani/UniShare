import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import { Separator } from "./ui/separator";

const UploadFileMenu = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Create Notes
          <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a study material in any format</DialogTitle>
          <Field>
            <FieldLabel htmlFor="file">File</FieldLabel>
            <Input id="file" type="file" />
            <FieldDescription>Select a file to upload.</FieldDescription>
          </Field>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileMenu;
