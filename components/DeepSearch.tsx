import { useState } from "react";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
import { Field, FieldGroup, FieldLabel } from "./ui/Field";
import { Input } from "./ui/Input";

export default function DeepSearch({ onSearch }: any) {
  const [uni, setUni] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [classNumber, setClassNumber] = useState<string | null>(null);
  const [types, setTypes] = useState<string[]>(["Class"]);

  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      setTypes((prev) => [...prev, value]);
    } else {
      setTypes((prev) => prev.filter((item) => item !== value));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Field className="max-w-xs">
        <FieldLabel htmlFor="search-uni">University</FieldLabel>
        <Input
          onChange={(e) => {
            setUni(e.target.value == "" ? null : e.target.value);
          }}
          placeholder="Eötvös Loránd Tudományegyetem"
          id="search-uni"
        />
      </Field>
      <Field className="max-w-xs">
        <FieldLabel htmlFor="course-search">Course</FieldLabel>
        <Input
          onChange={(e) => {
            setCourse(e.target.value == "" ? null : e.target.value);
          }}
          placeholder="Python"
          id="course-search"
        />
      </Field>
      <Field className="max-w-xs">
        <FieldLabel htmlFor="class-search">Class</FieldLabel>
        <Input
          onChange={(e) => {
            setClassNumber(e.target.value == "" ? null : e.target.value);
          }}
          placeholder="1-12"
          type="number"
          max={12}
          min={1}
          id="class-search"
        />
      </Field>
      <Field className="max-w-xs">
        <FieldLabel htmlFor="name-search">Name</FieldLabel>
        <Input
          onChange={(e) => {
            setName(e.target.value == "" ? null : e.target.value);
          }}
          placeholder="first_class"
          id="name-search"
        />
      </Field>
      <div className="flex flex-row">
        <FieldGroup className="gap-2">
          <Field orientation="horizontal">
            <Checkbox
              id="cbx-lecture"
              name="cbx-lecture"
              checked={types.includes("Class")}
              onCheckedChange={(checked) =>
                handleChange("Class", checked as boolean)
              }
            />
            <FieldLabel htmlFor="cbx-lecture">Lecture</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="cbx-exam"
              name="cbx-exam"
              checked={types.includes("Exam")}
              onCheckedChange={(checked) =>
                handleChange("Exam", checked as boolean)
              }
            />
            <FieldLabel htmlFor="cbx-exam">Exam</FieldLabel>
          </Field>
        </FieldGroup>
        <Button
          className="w-1/3"
          onClick={() =>
            onSearch({
              uni: uni,
              course: course,
              class: classNumber,
              name: name,
              types: types,
            })
          }
        >
          Search
        </Button>
      </div>
    </div>
  );
}
