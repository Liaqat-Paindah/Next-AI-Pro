import Loading from "@/app/loading";
import React, { Suspense } from "react";
import ServicesPage from "@/components/services/page";

const Services = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ServicesPage></ServicesPage>
      </Suspense>
    </>
  );
};

export default Services;
