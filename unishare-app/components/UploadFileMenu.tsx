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

const UploadFileMenu = () => {
  return (
    <Dialog>
      <DialogTrigger>Create Note</DialogTrigger>
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
