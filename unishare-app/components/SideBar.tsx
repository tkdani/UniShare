import { Separator } from "./ui/separator";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

type SideBarProps = {
  title: string;
};

const SideBar = ({ title }: SideBarProps) => {
  return (
    <div className="flex max-w-md w-1/5 flex-col gap-4 text-sm p-4 bg-sidebar rounded-md">
      <div className="text-2xl font-extrabold tracking-tight text-balance">
        {title}
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <Field className="max-w-xs">
          <FieldLabel htmlFor="search-uni">University</FieldLabel>
          <Input placeholder="Eötvös Loránd Tudományegyetem" id="search-uni" />
        </Field>
        <Field className="max-w-xs">
          <FieldLabel htmlFor="inline-start-input">Course</FieldLabel>
          <Input placeholder="Webprogramozás" id="course-search" />
        </Field>
        <Field className="max-w-xs">
          <FieldLabel htmlFor="inline-start-input">Class</FieldLabel>
          <Input
            placeholder="1-12"
            type="number"
            max={12}
            min={1}
            id="class-search"
          />
        </Field>
        <div className="flex flex-row">
          <FieldGroup className="flex-row">
            <Field orientation="horizontal">
              <Checkbox id="cbx-lecture" name="cbx-lecture" defaultChecked />
              <FieldLabel htmlFor="cbx-lecture">Lecture</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="cbx-exam" name="cbx-exam" />
              <FieldLabel htmlFor="cbx-exam">exam</FieldLabel>
            </Field>
          </FieldGroup>
          <Button className="w-1/3">Search</Button>
        </div>
      </div>
      <Separator />
      <div></div>
    </div>
  );
};

export default SideBar;
