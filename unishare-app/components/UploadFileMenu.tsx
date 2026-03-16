"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

import { Input } from "@/components/ui/Input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/Field";
import { Button } from "./ui/Button";
import { CirclePlus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/RadioGroup";
import { Label } from "./ui/Label";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./Dropzone";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";
import { convertShortname } from "@/lib/utils";
import useProfile from "@/hooks/useProfile";

export default function UploadFileMenu() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const [university, setUniversity] = useState<string | null>(null);
  const [universityShort, setUniversityShort] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);
  const [lesson, setLesson] = useState<number | null>(null);
  const [isClassType, setIsClassType] = useState<boolean>(true);
  const profile = useProfile();

  const isFormValid = university && course;

  const fileSettings = useSupabaseUpload({
    bucketName: "files",
    path: lesson
      ? `${universityShort}/${course}/${lesson}`
      : `${universityShort}/${course}`,
    allowedMimeTypes: [
      "image/*",
      "text/*",
      "application/pdf",
      "application/json",
    ],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

  useEffect(() => {
    if (fileSettings.isSuccess && fileSettings.successes.length > 0) {
      const fileName = fileSettings.successes[0];
      const filePath = lesson
        ? `${universityShort}/${course}/${lesson}/${fileName}`
        : `${universityShort}/${course}/${fileName}`;

      const {
        data: { publicUrl },
      } = supabase.storage.from("files").getPublicUrl(filePath);

      const uploadFile = async () => {
        const { error } = await supabase.from("user_files").insert({
          owner_id: user.id,
          university,
          course,
          type: isClassType ? "Class" : "Exam",
          lesson,
          file_name: fileName,
          url: publicUrl,
        });

        if (error) console.log(error);
      };

      uploadFile();
    }
  }, [fileSettings.isSuccess]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    fetchUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <Dialog>
          <DialogTrigger
            render={
              <Button disabled={profile?.is_banned}>
                Create Notes
                <CirclePlus />
              </Button>
            }
          ></DialogTrigger>
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
                <Input
                  onChange={(e) => {
                    setUniversityShort(convertShortname(e.target.value));
                    setUniversity(e.target.value);
                  }}
                  id="uni-name"
                  placeholder="ELTE"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="course-name">Course</FieldLabel>
                <Input
                  onChange={(e) => {
                    setCourse(e.target.value);
                  }}
                  id="course-name"
                  placeholder="Webfejlesztés"
                />
              </Field>
              <div className="flex flex-row justify-between">
                <Field orientation="horizontal" className="w-2/3">
                  <RadioGroup defaultValue="class" className="w-fit">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        onChange={() => setIsClassType(!isClassType)}
                        value="class"
                        id="r1"
                      />
                      <Label htmlFor="r1">Class</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        onChange={() => setIsClassType(!isClassType)}
                        value="exam"
                        id="r2"
                      />
                      <Label htmlFor="r2">Exam</Label>
                    </div>
                  </RadioGroup>
                </Field>
                <Field className="w-1/3">
                  <FieldLabel htmlFor="class-number">Class</FieldLabel>
                  <Input
                    onChange={(e) => {
                      setLesson(e.target.valueAsNumber);
                    }}
                    id="class-number"
                    placeholder="0-12"
                    type="number"
                    min={1}
                    max={12}
                    className=""
                  />
                </Field>
              </div>
              <div
                className={`relative ${!isFormValid ? "pointer-events-none opacity-50" : ""}`}
              >
                <Dropzone {...fileSettings}>
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </div>
            </FieldGroup>
          </DialogContent>
        </Dialog>
      ) : (
        <Button>
          <Link
            href="/auth/login"
            className="flex justify-center items-center gap-2"
          >
            Create a note
            <CirclePlus />
          </Link>
        </Button>
      )}
    </>
  );
}
