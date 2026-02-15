import React, { Suspense } from "react";
import LoginPage from "@/components/auth/login/page";

const Login = () => {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className=" max-w-sm">
            <LoginPage></LoginPage>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Login;
