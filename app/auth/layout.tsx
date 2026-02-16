import Footer from "@/components/shared/navigation/footer";
import Header from "@/components/shared/navigation/header";
import React from "react";

const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header></Header>
      {children}
      <Footer></Footer>
    </>
  );
};

export default LayoutAuth;
