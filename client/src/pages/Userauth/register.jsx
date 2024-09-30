import Commonform from "@/components/common/form";
import { registerFromControls } from "@/config";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
const initialState = {
  userName: "",
  email: "",
  password: "",
};

function Register() {
  const [formData, setFormData] = useState(initialState);
  const onSubmit = () => {};

  return (
    <div className="mx-uto w-full max-w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <Commonform
        formControls={registerFromControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default Register;
