import React, { Suspense } from "react";
import RegisterForm from "@/components/auth/register/page";

const Register = () => {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <RegisterForm></RegisterForm>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Register;
