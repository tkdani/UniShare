import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
import { Field, FieldGroup, FieldLabel } from "./ui/Field";
import { Input } from "./ui/Input";

export default function DeepSearch() {
  return (
    <div className="flex flex-col gap-3">
      <Field className="max-w-xs">
        <FieldLabel htmlFor="search-uni">University</FieldLabel>
        <Input placeholder="Eötvös Loránd Tudományegyetem" id="search-uni" />
      </Field>
      <Field className="max-w-xs">
        <FieldLabel htmlFor="course-search">Course</FieldLabel>
        <Input placeholder="Webprogramozás" id="course-search" />
      </Field>
      <Field className="max-w-xs">
        <FieldLabel htmlFor="class-search">Class</FieldLabel>
        <Input
          placeholder="1-12"
          type="number"
          max={12}
          min={1}
          id="class-search"
        />
      </Field>
      <div className="flex flex-row">
        <FieldGroup className="gap-2">
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
  );
}
