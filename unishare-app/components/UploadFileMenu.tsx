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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import { Separator } from "./ui/separator";
import { InputGroup, InputGroupInput } from "./ui/input-group";
import { Checkbox } from "./ui/checkbox";

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
          <DialogTitle>Create a note</DialogTitle>
          <DialogDescription>
            Upload a study material in any format
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="uni-name">University</FieldLabel>
            <Input id="uni-name" placeholder="ELTE" />
          </Field>
          <Field>
            <FieldLabel htmlFor="course-name">Course</FieldLabel>
            <Input id="course-name" placeholder="Webfejlesztés" />
          </Field>
          <div className="flex flex-row justify-between">
            <Field orientation="horizontal" className="w-2/3">
              <Checkbox id="cbx-lecture" name="cbx-lecture" defaultChecked />
              <FieldLabel htmlFor="cbx-lecture">Lecture</FieldLabel>
              <Checkbox id="cbx-exam" name="cbx-exam" />
              <FieldLabel htmlFor="cbx-exam">exam</FieldLabel>
            </Field>
            <Field className="w-1/3">
              <FieldLabel htmlFor="class-number">Class</FieldLabel>
              <Input
                id="class-number"
                placeholder="0-12"
                type="number"
                min={1}
                max={12}
                className=""
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="file">File</FieldLabel>
            <Input id="file" type="file" />
            <FieldDescription>Select a file to upload.</FieldDescription>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileMenu;
