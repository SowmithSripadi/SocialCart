import Commonform from "@/components/common/form";
import { loginFromControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/Userauth-slice";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const initialState = {
  email: "",
  password: "",
};

function Login() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="mx-uto w-full max-w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <Commonform
        formControls={loginFromControls}
        buttonText={"Log In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        className={"flex justify-center"}
      />
    </div>
  );
}

export default Login;
