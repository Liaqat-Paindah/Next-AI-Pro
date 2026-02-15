import React, { Suspense } from "react";
import LoginPage from "@/components/auth/login/page";

const Login = () => {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginPage></LoginPage>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Login;
