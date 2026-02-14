import React, { Suspense } from "react";
import LoginPage from "@/components/auth/login/page";

const Login = () => {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <LoginPage></LoginPage>
      </Suspense>
    </>
  );
};

export default Login;
