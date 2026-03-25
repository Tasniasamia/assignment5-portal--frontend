import PageBanner from "@/components/common/banner";
import RegisterForm from "@/components/modules/auth/registerForm";
import React from "react";

const Register = () => {
  return (
    <div>
      <PageBanner title="Register" />
      <RegisterForm />
    </div>
  );
};

export default Register;
