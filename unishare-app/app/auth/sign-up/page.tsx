import NavBar from "@/components/NavBar";
import { SignUpForm } from "@/components/SignUpForm";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="h-max">
        <NavBar />
      </div>
      <div className="flex justify-center items-center flex-1">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
